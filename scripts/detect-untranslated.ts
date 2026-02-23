#!/usr/bin/env bun

import { readdir, readFile } from "fs/promises";
import { dirname, join, relative } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = join(__dirname, "..", "docs");
const SOURCE_LOCALE = "en";
const TARGET_LOCALES = ["zh", "es", "fr", "de", "ja", "ko", "pt", "ru", "it", "tr"];

const LOCALE_NAMES: Record<string, string> = {
  zh: "Chinese (Simplified)",
  es: "Spanish",
  fr: "French",
  de: "German",
  ja: "Japanese",
  ko: "Korean",
  pt: "Portuguese",
  ru: "Russian",
  it: "Italian",
  tr: "Turkish",
};

const ENGLISH_INDICATORS = [
  /^#{1,3}\s+(This|The|A|An|In|If|You|When|Before|After|Once|To|For|How|What|Why|Where|Which|Who)\s/gim,
  /\b(This guide|You will need|You should|In this guide|If you have|The following|This section|This page|Welcome to|Getting started)\b/gi,
  /\b(Click on|Navigate to|Make sure|Keep in mind|Note that|Remember that|Be aware|Important:|Warning:|Tip:)\b/gi,
];

const FALSE_POSITIVE_PATTERNS = [/```[\s\S]*?```/g, /`[^`]+`/g, /<[A-Z][a-zA-Z]*[^>]*(?:\/>|>[\s\S]*?<\/[A-Z][a-zA-Z]*>)/g, /!!!include\([^)]+\)!!!/g];

interface UntranslatedFile {
  locale: string;
  relativePath: string;
  fullPath: string;
  englishMatches: string[];
  confidence: "high" | "medium" | "low";
}

async function getMarkdownFiles(dir: string): Promise<string[]> {
  const files: string[] = [];

  async function walk(currentDir: string): Promise<void> {
    const entries = await readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (!entry.name.startsWith(".") && entry.name !== "images") {
          await walk(fullPath);
        }
      } else if (entry.name.endsWith(".md") || entry.name.endsWith(".mdx")) {
        files.push(fullPath);
      }
    }
  }

  await walk(dir);
  return files;
}

function stripCodeAndComponents(content: string): string {
  let stripped = content;
  for (const pattern of FALSE_POSITIVE_PATTERNS) {
    stripped = stripped.replace(pattern, "");
  }
  return stripped;
}

function detectEnglishContent(content: string): { matches: string[]; confidence: "high" | "medium" | "low" } {
  const stripped = stripCodeAndComponents(content);
  const matches: string[] = [];

  for (const pattern of ENGLISH_INDICATORS) {
    const found = stripped.match(pattern);
    if (found) {
      matches.push(...found.slice(0, 5));
    }
  }

  const uniqueMatches = [...new Set(matches)];

  if (uniqueMatches.length >= 10) {
    return { matches: uniqueMatches, confidence: "high" };
  } else if (uniqueMatches.length >= 5) {
    return { matches: uniqueMatches, confidence: "medium" };
  } else if (uniqueMatches.length >= 2) {
    return { matches: uniqueMatches, confidence: "low" };
  }

  return { matches: [], confidence: "low" };
}

async function scanLocale(locale: string): Promise<UntranslatedFile[]> {
  const localeDir = join(DOCS_DIR, locale);
  const untranslated: UntranslatedFile[] = [];

  try {
    const files = await getMarkdownFiles(localeDir);

    for (const fullPath of files) {
      const content = await readFile(fullPath, "utf-8");
      const { matches, confidence } = detectEnglishContent(content);

      if (matches.length >= 2) {
        untranslated.push({
          locale,
          relativePath: relative(localeDir, fullPath),
          fullPath,
          englishMatches: matches,
          confidence,
        });
      }
    }
  } catch {
    console.error(`Could not scan locale: ${locale}`);
  }

  return untranslated;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const outputJson = args.includes("--json");
  const highOnly = args.includes("--high");
  const positionalArgs = args.filter((a) => !a.startsWith("--"));
  const targetLocale = positionalArgs[0];
  const locales = targetLocale ? [targetLocale] : TARGET_LOCALES;

  if (targetLocale && !TARGET_LOCALES.includes(targetLocale)) {
    console.error(`Invalid locale: ${targetLocale}`);
    console.error(`Valid locales: ${TARGET_LOCALES.join(", ")}`);
    process.exit(1);
  }

  const allUntranslated: UntranslatedFile[] = [];

  for (const locale of locales) {
    const results = await scanLocale(locale);
    allUntranslated.push(...results);
  }

  const filtered = highOnly ? allUntranslated.filter((f) => f.confidence === "high") : allUntranslated;

  if (outputJson) {
    console.log(JSON.stringify(filtered, null, 2));
    return;
  }

  if (filtered.length === 0) {
    console.log("No untranslated files detected.");
    return;
  }

  console.log(`Found ${filtered.length} files with English content:\n`);

  const byLocale = new Map<string, UntranslatedFile[]>();
  for (const file of filtered) {
    const list = byLocale.get(file.locale) || [];
    list.push(file);
    byLocale.set(file.locale, list);
  }

  for (const [locale, files] of byLocale) {
    const high = files.filter((f) => f.confidence === "high").length;
    const medium = files.filter((f) => f.confidence === "medium").length;
    const low = files.filter((f) => f.confidence === "low").length;

    console.log(`### ${LOCALE_NAMES[locale]} (${locale}) - ${files.length} files (high: ${high}, medium: ${medium}, low: ${low})`);

    const sorted = files.sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.confidence] - order[b.confidence];
    });

    for (const file of sorted) {
      console.log(`  [${file.confidence}] ${file.relativePath}`);
      if (file.confidence === "high") {
        console.log(`    Matches: ${file.englishMatches.slice(0, 3).join(", ")}`);
      }
    }
    console.log();
  }
}

main().catch(console.error);
