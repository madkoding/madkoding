#!/usr/bin/env bash
#
# Deletes the Actions artifacts and caches that are past the retention window in
# every repository the token can reach.
#
# The artifacts endpoint ignores the `created` query parameter, so every page is
# listed and the entries past the cutoff are picked here instead.
#
# The endpoints are written without the leading slash on purpose: gh resolves
# them against api.github.com, and a leading slash gets rewritten into a
# filesystem path by the MSYS shell of Git for Windows.
#
# Usage: purge-artifacts.sh [max_age_days] [cache_age_days]
set -euo pipefail

max_age_days="${1:-7}"
cache_age_days="${2:-30}"
owner="${GITHUB_REPOSITORY_OWNER:-${OWNER:-madkoding}}"

# Without the token gh answers 401 to everything and the sweep would finish
# having done nothing at all, so this fails loudly instead.
if [ -z "${GH_TOKEN:-}" ]; then
  echo "GH_TOKEN no esta definido: hace falta el secret ARTIFACT_CLEANUP_TOKEN" >&2
  exit 1
fi

cutoff="$(date -u -d "${max_age_days} days ago" +%Y-%m-%dT%H:%M:%SZ)"
cache_cutoff="$(date -u -d "${cache_age_days} days ago" +%Y-%m-%dT%H:%M:%SZ)"

echo "owner:                  ${owner}"
echo "artefactos anteriores a ${cutoff} (${max_age_days}d)"
echo "caches anteriores a    ${cache_cutoff} (${cache_age_days}d)"

list_repos() {
  gh api "/user/repos?per_page=100&affiliation=owner" --paginate \
    --jq '.[].full_name' 2>/dev/null \
    || gh api "/users/${owner}/repos?per_page=100" --paginate \
      --jq '.[].full_name' 2>/dev/null \
    || true
}

# delete_ids <repo> <ids> <base-path> -> prints how many were deleted
delete_ids() {
  local repo="$1" ids="$2" base="$3" count=0 id
  if [ -z "${ids}" ]; then
    echo 0
    return
  fi
  while read -r id; do
    # A repository that answers with an error (a blocked one, for example)
    # prints its JSON body instead of the list, so only real ids are kept.
    [[ "${id}" =~ ^[0-9]+$ ]] || continue
    if gh api --method DELETE "${base}/${id}" >/dev/null 2>&1; then
      count=$((count + 1))
    else
      echo "  ! no se pudo borrar ${id} de ${repo}" >&2
    fi
  done <<< "${ids}"
  echo "${count}"
}

total_artifacts=0
total_caches=0
repo_count=0

while read -r repo; do
  [ -z "${repo}" ] && continue
  repo_count=$((repo_count + 1))

  artifact_ids=$(gh api "repos/${repo}/actions/artifacts?per_page=100" --paginate \
    --jq ".artifacts[] | select(.created_at < \"${cutoff}\") | .id" 2>/dev/null || true)
  deleted_artifacts=$(delete_ids "${repo}" "${artifact_ids}" "repos/${repo}/actions/artifacts")

  cache_ids=$(gh api "repos/${repo}/actions/caches?per_page=100" --paginate \
    --jq ".actions_caches[] | select(.last_accessed_at < \"${cache_cutoff}\") | .id" 2>/dev/null || true)
  deleted_caches=$(delete_ids "${repo}" "${cache_ids}" "repos/${repo}/actions/caches")

  total_artifacts=$((total_artifacts + deleted_artifacts))
  total_caches=$((total_caches + deleted_caches))

  if [ "${deleted_artifacts}" != "0" ] || [ "${deleted_caches}" != "0" ]; then
    echo "${repo}: ${deleted_artifacts} artefactos, ${deleted_caches} caches"
  fi

  # Be gentle with the API: the listing of each repository already costs one
  # call per hundred artifacts.
  sleep 1
done <<< "$(list_repos)"

echo "repositorios revisados: ${repo_count}"
echo "artefactos borrados:   ${total_artifacts}"
echo "caches borradas:       ${total_caches}"

if [ -n "${GITHUB_STEP_SUMMARY:-}" ]; then
  {
    echo "### cleanup-artifacts"
    echo ""
    echo "- repositorios revisados: ${repo_count}"
    echo "- artefactos borrados: ${total_artifacts}"
    echo "- caches borradas: ${total_caches}"
    echo "- ventana de artefactos: ${max_age_days}d"
  } >> "${GITHUB_STEP_SUMMARY}"
fi
