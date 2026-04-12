#!/usr/bin/env bash
set -euo pipefail

PROJECT="${1:-}"

if [ -z "$PROJECT" ]; then
  echo "Usage: $0 <pages-project-name>"
  exit 1
fi

if [ -z "${CLOUDFLARE_ACCOUNT_ID:-}" ]; then
  echo "CLOUDFLARE_ACCOUNT_ID is not set"
  exit 1
fi

if [ -z "${CLOUDFLARE_API_TOKEN:-}" ]; then
  echo "CLOUDFLARE_API_TOKEN is not set"
  exit 1
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "curl is required"
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required"
  exit 1
fi

DRY_RUN="${DRY_RUN:-0}"
BRANCH_REGEX="${BRANCH_REGEX:-}"
KEEP_NEWEST_PRODUCTION="${KEEP_NEWEST_PRODUCTION:-1}"

BASE_URL="https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/pages/projects/${PROJECT}/deployments"

api_get() {
  curl -fsS \
    -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
    -H "Content-Type: application/json" \
    "$BASE_URL"
}

api_delete() {
  local id="$1"
  curl -fsS -X DELETE \
    -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
    -H "Content-Type: application/json" \
    "${BASE_URL}/${id}"
}

echo "Fetching deployments for project: $PROJECT"
ALL_DEPLOYMENTS_JSON="$(api_get)"

SUCCESS="$(printf '%s\n' "$ALL_DEPLOYMENTS_JSON" | jq -r '.success')"
if [ "$SUCCESS" != "true" ]; then
  echo "API returned success=false"
  printf '%s\n' "$ALL_DEPLOYMENTS_JSON" | jq .
  exit 1
fi

TOTAL_COUNT="$(printf '%s\n' "$ALL_DEPLOYMENTS_JSON" | jq '(.result // []) | length')"
echo "Total deployments returned: $TOTAL_COUNT"

if [ "$TOTAL_COUNT" -eq 0 ]; then
  echo "Nothing to do."
  exit 0
fi

TO_DELETE_JSON="$(
  printf '%s\n' "$ALL_DEPLOYMENTS_JSON" | jq -c \
    --arg project "$PROJECT" \
    --arg branch_regex "$BRANCH_REGEX" \
    --argjson keep_prod "$KEEP_NEWEST_PRODUCTION" '
    def branch_name:
      (
        .deployment_trigger.metadata.branch //
        .deployment_trigger.metadata.ref //
        (
          (.aliases // [])
          | map(
              select(type == "string")
              | select(endswith("." + $project + ".pages.dev"))
              | sub("\\." + $project + "\\.pages\\.dev$"; "")
            )
          | .[0]
        ) //
        "__unknown__"
      );

    def preview_branch_allowed:
      if $branch_regex == "" then true
      else (branch_name | test($branch_regex))
      end;

    (
      (
        [ .result[]
          | select(.id != null and .id != "")
          | select(.environment == "production")
        ]
        | sort_by(.created_on)
        | reverse
        | if $keep_prod == 1 then .[1:] else . end
        | map({
            id,
            environment,
            created_on,
            branch: "production",
            url: (.url // ""),
            reason: "old production deployment"
          })
      )
      +
      (
        [ .result[]
          | select(.id != null and .id != "")
          | select(.environment == "preview")
          | . + { _branch_name: branch_name }
          | select(preview_branch_allowed)
        ]
        | sort_by(.created_on)
        | reverse
        | group_by(._branch_name)
        | map(.[1:][])
        | map({
            id,
            environment,
            created_on,
            branch: ._branch_name,
            url: (.url // ""),
            reason: "old preview deployment for branch " + ._branch_name
          })
      )
    )
  '
)"

DELETE_COUNT="$(printf '%s\n' "$TO_DELETE_JSON" | jq 'length')"
echo "Deployments selected for deletion: $DELETE_COUNT"

if [ "$DELETE_COUNT" -eq 0 ]; then
  echo "Nothing matched the cleanup rules."
  exit 0
fi

echo
echo "Preview of deletions:"
printf '%s\n' "$TO_DELETE_JSON" | jq -r '
  .[]
  | [.environment, .branch, .created_on, .id, .url]
  | @tsv
'

echo
if [ "$DRY_RUN" = "1" ]; then
  echo "DRY_RUN=1 set. No deletions performed."
  exit 0
fi

SUCCESS_COUNT=0
FAIL_COUNT=0

while IFS= read -r row; do
  id="$(printf '%s\n' "$row" | jq -r '.id')"
  env="$(printf '%s\n' "$row" | jq -r '.environment')"
  branch="$(printf '%s\n' "$row" | jq -r '.branch')"
  created_on="$(printf '%s\n' "$row" | jq -r '.created_on')"

  [ -z "$id" ] && continue
  [ "$id" = "null" ] && continue

  echo "Deleting ${env} ${branch} ${created_on} ${id}"

  if api_delete "$id" >/dev/null 2>&1; then
    SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
  else
    echo "Skipped/failed: ${id}"
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi
done < <(printf '%s\n' "$TO_DELETE_JSON" | jq -c '.[]')

echo
echo "Finished."
echo "Deleted: $SUCCESS_COUNT"
echo "Failed/skipped: $FAIL_COUNT"
