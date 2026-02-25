// ============================================================================
// GitHub Actions Specific Helpers
// ============================================================================

import { isInsideGithubAction, type CIDetectionOptions } from "./ci.js";

/**
 * Gets the GitHub token from environment
 *
 * @throws Error if not running in GitHub Actions or token not available
 *
 * @example
 * ```typescript
 * try {
 *   const token = getGithubToken();
 *   // Use token for API calls
 * } catch (e) {
 *   console.error("GitHub token not available");
 * }
 * ```
 */
export function getGithubToken(options?: CIDetectionOptions): string {
  // By default, require being inside GitHub Actions unless explicitly disabled
  const skipCiCheck = options?.strict === false;

  if (!skipCiCheck && !isInsideGithubAction(options)) {
    throw new Error("Not running inside GitHub Actions");
  }

  const env = options?.env ?? process.env;
  const token = env["GITHUB_TOKEN"] ?? env["GH_TOKEN"];

  if (!token) {
    throw new Error(
      "GitHub token not found in environment (GITHUB_TOKEN or GH_TOKEN)",
    );
  }

  return token;
}

/**
 * Gets GitHub Actions event name (push, pull_request, etc.)
 */
export function getGithubEventName(
  options?: CIDetectionOptions,
): string | undefined {
  const env = options?.env ?? process.env;
  return env["GITHUB_EVENT_NAME"];
}

/**
 * Gets the GitHub repository owner and name
 *
 * @returns Object with owner and repo, or null if not available
 */
export function getGithubRepository(
  options?: CIDetectionOptions,
): { owner: string; repo: string } | null {
  const env = options?.env ?? process.env;
  const fullRepo = env["GITHUB_REPOSITORY"];

  if (!fullRepo) return null;

  const [owner, repo] = fullRepo.split("/");
  if (!owner || !repo) return null;

  return { owner, repo };
}

/**
 * Gets the GitHub Actions run ID
 */
export function getGithubRunId(
  options?: CIDetectionOptions,
): string | undefined {
  const env = options?.env ?? process.env;
  return env["GITHUB_RUN_ID"];
}

/**
 * Gets the GitHub Actions run attempt number
 */
export function getGithubRunAttempt(
  options?: CIDetectionOptions,
): string | undefined {
  const env = options?.env ?? process.env;
  return env["GITHUB_RUN_ATTEMPT"];
}

/**
 * Gets the GitHub Actions workflow name
 */
export function getGithubWorkflow(
  options?: CIDetectionOptions,
): string | undefined {
  const env = options?.env ?? process.env;
  return env["GITHUB_WORKFLOW"];
}

/**
 * Gets the GitHub Actions job name
 */
export function getGithubJob(options?: CIDetectionOptions): string | undefined {
  const env = options?.env ?? process.env;
  return env["GITHUB_JOB"];
}

/**
 * Gets the GitHub user who triggered the workflow
 */
export function getGithubActor(
  options?: CIDetectionOptions,
): string | undefined {
  const env = options?.env ?? process.env;
  return env["GITHUB_ACTOR"];
}

/**
 * Gets the Git ref (branch or tag) that triggered the workflow
 */
export function getGithubRef(options?: CIDetectionOptions): string | undefined {
  const env = options?.env ?? process.env;
  return env["GITHUB_REF"];
}

/**
 * Gets the Git ref name (short version without refs/heads/ or refs/tags/)
 */
export function getGithubRefName(
  options?: CIDetectionOptions,
): string | undefined {
  const env = options?.env ?? process.env;
  return env["GITHUB_REF_NAME"];
}

/**
 * Gets the commit SHA that triggered the workflow
 */
export function getGithubSha(options?: CIDetectionOptions): string | undefined {
  const env = options?.env ?? process.env;
  return env["GITHUB_SHA"];
}

/**
 * Gets the path to the GitHub event payload JSON file
 */
export function getGithubEventPath(
  options?: CIDetectionOptions,
): string | undefined {
  const env = options?.env ?? process.env;
  return env["GITHUB_EVENT_PATH"];
}

/**
 * Reads and parses the GitHub event payload (async)
 *
 * @returns The parsed event payload or null if not available
 */
export async function getGithubEventPayload<T = Record<string, unknown>>(
  options?: CIDetectionOptions,
): Promise<T | null> {
  const path = getGithubEventPath(options);
  if (!path) return null;

  try {
    const fs = await import("node:fs/promises");
    const content = await fs.readFile(path, "utf-8");
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

/**
 * Reads and parses the GitHub event payload (sync)
 *
 * @returns The parsed event payload or null if not available
 */
export function getGithubEventPayloadSync<T = Record<string, unknown>>(
  options?: CIDetectionOptions,
): T | null {
  const path = getGithubEventPath(options);
  if (!path) return null;

  try {
    const fs = require("node:fs");
    const content = fs.readFileSync(path, "utf-8");
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

/**
 * Checks if running in a GitHub Actions pull request context
 */
export function isGithubPullRequest(options?: CIDetectionOptions): boolean {
  const eventName = getGithubEventName(options);
  return eventName === "pull_request" || eventName === "pull_request_target";
}

/**
 * Gets the PR number if running in a pull request context
 *
 * @returns PR number or null if not in PR context
 */
export function getGithubPullRequestNumber(
  options?: CIDetectionOptions,
): number | null {
  if (!isGithubPullRequest(options)) return null;

  const env = options?.env ?? process.env;
  const prNumber = env["GITHUB_REF"]?.match(/refs\/pull\/(\d+)\/merge/)?.[1];
  return prNumber ? parseInt(prNumber, 10) : null;
}

/**
 * Gets GitHub Actions specific debug state
 */
export function isGithubDebug(options?: CIDetectionOptions): boolean {
  const env = options?.env ?? process.env;
  return env["RUNNER_DEBUG"] === "1" || env["ACTIONS_STEP_DEBUG"] === "true";
}

/**
 * Gets the GitHub API URL (for GitHub Enterprise Server support)
 */
export function getGithubApiUrl(options?: CIDetectionOptions): string {
  const env = options?.env ?? process.env;
  return env["GITHUB_API_URL"] ?? "https://api.github.com";
}

/**
 * Gets the GitHub server URL (for GitHub Enterprise Server support)
 */
export function getGithubServerUrl(options?: CIDetectionOptions): string {
  const env = options?.env ?? process.env;
  return env["GITHUB_SERVER_URL"] ?? "https://github.com";
}

/**
 * Gets the workspace path where the repository is checked out
 */
export function getGithubWorkspace(
  options?: CIDetectionOptions,
): string | undefined {
  const env = options?.env ?? process.env;
  return env["GITHUB_WORKSPACE"];
}
