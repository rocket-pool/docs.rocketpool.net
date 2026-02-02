#!/usr/bin/env bun

import { readdir, readFile, writeFile, mkdir, stat } from "fs/promises";
import { join, relative, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, "..");
const DOCS_DIR = join(__dirname, "..", "docs");
const SOURCE_LOCALE = "en";
const TARGET_LOCALES = ["zh", "es", "fr", "de", "ja", "ko", "pt", "ru", "it", "tr"];

interface TranslationJob {
  sourcePath: string;
  targetLocale: string;
  targetPath: string;
  reason: "new" | "changed";
}

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

function extractFrontmatter(content: string): { frontmatter: string | null; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (match) {
    return { frontmatter: match[1], body: match[2] };
  }
  return { frontmatter: null, body: content };
}

function preserveCodeBlocks(content: string): { processed: string; codeBlocks: string[] } {
  const codeBlocks: string[] = [];
  let index = 0;

  const processed = content.replace(/```[\s\S]*?```/g, (match) => {
    codeBlocks.push(match);
    return `<<<CODE_BLOCK_${index++}>>>`;
  });

  return { processed, codeBlocks };
}

function restoreCodeBlocks(content: string, codeBlocks: string[]): string {
  let result = content;
  codeBlocks.forEach((block, index) => {
    result = result.replace(`<<<CODE_BLOCK_${index}>>>`, block);
  });
  return result;
}

function preserveInlineCode(content: string): { processed: string; inlineCodes: string[] } {
  const inlineCodes: string[] = [];
  let index = 0;

  const processed = content.replace(/`[^`]+`/g, (match) => {
    inlineCodes.push(match);
    return `<<<INLINE_CODE_${index++}>>>`;
  });

  return { processed, inlineCodes };
}

function restoreInlineCode(content: string, inlineCodes: string[]): string {
  let result = content;
  inlineCodes.forEach((code, index) => {
    result = result.replace(`<<<INLINE_CODE_${index}>>>`, code);
  });
  return result;
}

function preserveLinks(content: string): { processed: string; links: string[] } {
  const links: string[] = [];
  let index = 0;

  const processed = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => {
    links.push(url);
    return `[${text}](<<<LINK_${index++}>>>)`;
  });

  return { processed, links };
}

function restoreLinks(content: string, links: string[]): string {
  let result = content;
  links.forEach((link, index) => {
    result = result.replace(`<<<LINK_${index}>>>`, link);
  });
  return result;
}

function preserveImages(content: string): { processed: string; images: string[] } {
  const images: string[] = [];
  let index = 0;

  const processed = content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (fullMatch) => {
    images.push(fullMatch);
    return `<<<IMAGE_${index++}>>>`;
  });

  return { processed, images };
}

function restoreImages(content: string, images: string[]): string {
  let result = content;
  images.forEach((image, index) => {
    result = result.replace(`<<<IMAGE_${index}>>>`, image);
  });
  return result;
}

function preserveIncludeStatements(content: string): { processed: string; includes: string[] } {
  const includes: string[] = [];
  let index = 0;

  const processed = content.replace(/!!!include\([^)]+\)!!!/g, (match) => {
    includes.push(match);
    return `<<<INCLUDE_${index++}>>>`;
  });

  return { processed, includes };
}

function restoreIncludeStatements(content: string, includes: string[]): string {
  let result = content;
  includes.forEach((inc, index) => {
    result = result.replace(`<<<INCLUDE_${index}>>>`, inc);
  });
  return result;
}

function preserveJsxComponents(content: string): { processed: string; components: string[] } {
  const components: string[] = [];
  let index = 0;

  const processed = content.replace(/<[A-Z][a-zA-Z]*[^>]*(?:\/>|>[\s\S]*?<\/[A-Z][a-zA-Z]*>)/g, (match) => {
    components.push(match);
    return `<<<JSX_${index++}>>>`;
  });

  return { processed, components };
}

function restoreJsxComponents(content: string, components: string[]): string {
  let result = content;
  components.forEach((comp, index) => {
    result = result.replace(`<<<JSX_${index}>>>`, comp);
  });
  return result;
}

async function translateWithClaude(text: string, targetLocale: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY environment variable is required");
  }

  const languageName = LOCALE_NAMES[targetLocale] || targetLocale;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8192,
      messages: [
        {
          role: "user",
          content: `Translate the following documentation from English to ${languageName}.

CRITICAL RULES:
1. Preserve ALL placeholders exactly as-is (<<<CODE_BLOCK_N>>>, <<<INLINE_CODE_N>>>, <<<LINK_N>>>, <<<IMAGE_N>>>, <<<INCLUDE_N>>>, <<<JSX_N>>>)
2. Do NOT translate technical terms, command names, file paths, or protocol names (e.g., Rocket Pool, Ethereum, MEV, RPL, rETH)
3. Preserve all markdown formatting (headers, lists, bold, italic, etc.)
4. Translate naturally for technical documentation readers
5. Return ONLY the translated text, no explanations

Text to translate:
${text}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${response.status} - ${error}`);
  }

  const data = (await response.json()) as { content: Array<{ type: string; text?: string }> };
  const textBlock = data.content.find((block) => block.type === "text");
  if (!textBlock || !textBlock.text) {
    throw new Error("No text content in Claude response");
  }

  return textBlock.text;
}

async function translateFile(sourcePath: string, targetLocale: string): Promise<string> {
  const content = await readFile(sourcePath, "utf-8");
  const { frontmatter, body } = extractFrontmatter(content);

  const codeResult = preserveCodeBlocks(body);
  const inlineResult = preserveInlineCode(codeResult.processed);
  const linkResult = preserveLinks(inlineResult.processed);
  const imageResult = preserveImages(linkResult.processed);
  const includeResult = preserveIncludeStatements(imageResult.processed);
  const jsxResult = preserveJsxComponents(includeResult.processed);

  const translatedBody = await translateWithClaude(jsxResult.processed, targetLocale);

  let restoredBody = restoreJsxComponents(translatedBody, jsxResult.components);
  restoredBody = restoreIncludeStatements(restoredBody, includeResult.includes);
  restoredBody = restoreImages(restoredBody, imageResult.images);
  restoredBody = restoreLinks(restoredBody, linkResult.links);
  restoredBody = restoreInlineCode(restoredBody, inlineResult.inlineCodes);
  restoredBody = restoreCodeBlocks(restoredBody, codeResult.codeBlocks);

  if (frontmatter) {
    return `---\n${frontmatter}\n---\n${restoredBody}`;
  }

  return restoredBody;
}

function getMainBranch(): string {
  try {
    const result = execSync("git rev-parse --verify main 2>/dev/null", { cwd: ROOT_DIR, encoding: "utf-8" });
    if (result.trim()) return "main";
  } catch {}

  try {
    const result = execSync("git rev-parse --verify master 2>/dev/null", { cwd: ROOT_DIR, encoding: "utf-8" });
    if (result.trim()) return "master";
  } catch {}

  return "main";
}

function getChangedEnglishFiles(): string[] {
  const mainBranch = getMainBranch();

  try {
    const output = execSync(`git diff ${mainBranch}...HEAD --name-only -- 'docs/en/**/*.md' 'docs/en/**/*.mdx'`, {
      cwd: ROOT_DIR,
      encoding: "utf-8",
    });

    return output
      .trim()
      .split("\n")
      .filter((f) => f.length > 0)
      .map((f) => join(ROOT_DIR, f));
  } catch {
    return [];
  }
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function getFileMtime(path: string): Promise<number> {
  try {
    const s = await stat(path);
    return s.mtimeMs;
  } catch {
    return 0;
  }
}

async function detectChanges(targetLocales: string[]): Promise<TranslationJob[]> {
  const sourceDir = join(DOCS_DIR, SOURCE_LOCALE);
  const changedFiles = getChangedEnglishFiles();
  const jobs: TranslationJob[] = [];

  for (const sourcePath of changedFiles) {
    const relativePath = relative(sourceDir, sourcePath);

    for (const targetLocale of targetLocales) {
      const targetPath = join(DOCS_DIR, targetLocale, relativePath);
      const targetExists = await fileExists(targetPath);

      if (!targetExists) {
        jobs.push({ sourcePath, targetLocale, targetPath, reason: "new" });
      } else {
        const sourceMtime = await getFileMtime(sourcePath);
        const targetMtime = await getFileMtime(targetPath);

        if (sourceMtime > targetMtime) {
          jobs.push({ sourcePath, targetLocale, targetPath, reason: "changed" });
        }
      }
    }
  }

  return jobs;
}

async function detectAllChanges(targetLocales: string[]): Promise<TranslationJob[]> {
  const sourceDir = join(DOCS_DIR, SOURCE_LOCALE);
  const sourceFiles = await getMarkdownFiles(sourceDir);
  const jobs: TranslationJob[] = [];

  for (const sourcePath of sourceFiles) {
    const relativePath = relative(sourceDir, sourcePath);

    for (const targetLocale of targetLocales) {
      const targetPath = join(DOCS_DIR, targetLocale, relativePath);
      const targetExists = await fileExists(targetPath);

      if (!targetExists) {
        jobs.push({ sourcePath, targetLocale, targetPath, reason: "new" });
      } else {
        const sourceMtime = await getFileMtime(sourcePath);
        const targetMtime = await getFileMtime(targetPath);

        if (sourceMtime > targetMtime) {
          jobs.push({ sourcePath, targetLocale, targetPath, reason: "changed" });
        }
      }
    }
  }

  return jobs;
}

async function processJobs(jobs: TranslationJob[], dryRun: boolean): Promise<void> {
  const sourceDir = join(DOCS_DIR, SOURCE_LOCALE);
  let completed = 0;
  const total = jobs.length;

  for (const job of jobs) {
    const relativePath = relative(sourceDir, job.sourcePath);
    console.log(`[${++completed}/${total}] Translating ${relativePath} → ${job.targetLocale} (${job.reason})`);

    if (dryRun) {
      continue;
    }

    try {
      const translatedContent = await translateFile(job.sourcePath, job.targetLocale);
      await mkdir(dirname(job.targetPath), { recursive: true });
      await writeFile(job.targetPath, translatedContent);

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`  Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0] || "check";

  switch (command) {
    case "check": {
      const jobs = await detectChanges(TARGET_LOCALES);
      if (jobs.length === 0) {
        console.log("All translations are up to date.");
        return;
      }

      console.log(`Found ${jobs.length} files needing translation:\n`);

      const byLocale = new Map<string, TranslationJob[]>();
      for (const job of jobs) {
        const list = byLocale.get(job.targetLocale) || [];
        list.push(job);
        byLocale.set(job.targetLocale, list);
      }

      for (const [locale, localeJobs] of byLocale) {
        console.log(`${LOCALE_NAMES[locale]} (${locale}): ${localeJobs.length} files`);
        for (const job of localeJobs.slice(0, 5)) {
          const relativePath = relative(join(DOCS_DIR, SOURCE_LOCALE), job.sourcePath);
          console.log(`  - ${relativePath} (${job.reason})`);
        }
        if (localeJobs.length > 5) {
          console.log(`  ... and ${localeJobs.length - 5} more`);
        }
        console.log();
      }
      break;
    }

    case "translate": {
      const targetLocale = args[1];
      const locales = targetLocale ? [targetLocale] : TARGET_LOCALES;

      if (targetLocale && !TARGET_LOCALES.includes(targetLocale)) {
        console.error(`Invalid locale: ${targetLocale}`);
        console.error(`Valid locales: ${TARGET_LOCALES.join(", ")}`);
        process.exit(1);
      }

      const jobs = await detectChanges(locales);
      if (jobs.length === 0) {
        console.log("All translations are up to date.");
        return;
      }

      console.log(`Translating ${jobs.length} files...`);
      await processJobs(jobs, false);
      console.log("Translation complete.");
      break;
    }

    case "translate-all": {
      const targetLocale = args[1];
      const locales = targetLocale ? [targetLocale] : TARGET_LOCALES;

      if (targetLocale && !TARGET_LOCALES.includes(targetLocale)) {
        console.error(`Invalid locale: ${targetLocale}`);
        process.exit(1);
      }

      const jobs = await detectAllChanges(locales);
      console.log(`Force re-translating ${jobs.length} files...`);
      await processJobs(jobs, false);
      console.log("Translation complete.");
      break;
    }

    case "dry-run": {
      const targetLocale = args[1];
      const locales = targetLocale ? [targetLocale] : TARGET_LOCALES;

      const jobs = await detectChanges(locales);
      if (jobs.length === 0) {
        console.log("All translations are up to date.");
        return;
      }

      console.log(`Dry run - would translate ${jobs.length} files:\n`);
      await processJobs(jobs, true);
      break;
    }

    default:
      console.log(`Usage: bun scripts/translate.ts <command> [locale]

Commands:
  check           Check which files need translation (git-based, compares to main)
  translate       Translate changed files (optionally specify locale)
  translate-all   Translate all files where source is newer than translation
  dry-run         Show what would be translated without translating

Locales: ${TARGET_LOCALES.join(", ")}

Environment:
  ANTHROPIC_API_KEY   Required for translation
`);
  }
}

main().catch(console.error);
