/**
 * GitHub Actions Specific Helpers
 * @see {https://docs.github.com/en/actions/reference/workflows-and-actions/variables}
 */

import { type CIDetectionOptions } from "./ci.js";
import { getEnv } from "./env.js";

/**
 * Detects if running inside GitHub Actions
 *
 * GitHub Actions sets the `GITHUB_ACTIONS` environment variable to "true"
 *
 * @example
 * ```typescript
 * if (isInsideGithubAction()) {
 *   console.log("Running in GitHub Actions");
 *   const token = getGithubToken(); // Safe to call
 * }
 * ```
 */
export function isInsideGithubAction(options?: CIDetectionOptions): boolean {
  const env = getEnv(options);
  return env["GITHUB_ACTIONS"] === "true";
}

/**
 * Gets the name of the action currently running, or the id of a step.
 *
 * GitHub Actions sets the `GITHUB_ACTION` environment variable which contains:
 * - For an action: `__repo-owner_name-of-action-repo` (special characters removed)
 * - For a step running a script without an id: `__run`
 * - For duplicate scripts/actions in the same job: a suffix with sequence number (e.g., `__run_2`, `actionscheckout2`)
 *
 * @example
 * ```typescript
 * const actionName = getGithubAction();
 * if (actionName) {
 *   console.log(`Running action: ${actionName}`);
 *   // Outputs: "__run", "__run_2", "__owner_repo-action", "actionscheckout2", etc.
 * }
 * ```
 *
 * @param options - Optional CI detection options
 * @returns The action/step identifier, or `undefined` if not running in GitHub Actions or if the variable is not set
 */
export function getGithubAction(
  options?: CIDetectionOptions,
): string | undefined {
  const env = getEnv(options);
  return env["GITHUB_ACTION"];
}

/**
 * Gets the path where an action is located.
 *
 * This property is only supported in composite actions. You can use this path
 * to change directories to where the action is located and access other files
 * in that same repository.
 *
 * @example
 * ```typescript
 * const actionPath = getGithubActionPath();
 * if (actionPath) {
 *   console.log(`Action located at: ${actionPath}`);
 *   // Outputs: "/home/runner/work/_actions/repo-owner/name-of-action-repo/v1"
 * }
 * ```
 *
 * @param options - Optional CI detection options
 * @returns The filesystem path to the action, or `undefined` if not running in
 *          GitHub Actions, not in a composite action, or if the variable is not set
 */
export function getGithubActionPath(
  options?: CIDetectionOptions,
): string | undefined {
  const env = getEnv(options);
  return env["GITHUB_ACTION_PATH"];
}

/**
 * Gets the owner and repository name of the action being executed.
 *
 * For a step executing an action, this environment variable contains the owner
 * and repository name in the format `owner/repo`.
 *
 * @example
 * ```typescript
 * const actionRepo = getGithubActionRepository();
 * if (actionRepo) {
 *   console.log(`Action repository: ${actionRepo}`);
 *   // Outputs: "actions/checkout"
 *   // Outputs: "octokit/request-action"
 * }
 * ```
 *
 * @param options - Optional CI detection options
 * @returns The owner and repository name of the action (e.g., "actions/checkout"),
 *          or `undefined` if not running in GitHub Actions, not executing an action,
 *          or if the variable is not set
 */
export function getGithubActionRepository(
  options?: CIDetectionOptions,
): string | undefined {
  const env = getEnv(options);
  return env["GITHUB_ACTION_REPOSITORY"];
}

/**
 * Gets the name of the person or app that initiated the workflow.
 *
 * This environment variable contains the username of the user or the name of the
 * app that triggered the workflow run.
 *
 * @example
 * ```typescript
 * const actor = getGithubActor();
 * if (actor) {
 *   console.log(`Workflow triggered by: ${actor}`);
 *   // Outputs: "octocat"
 *   // Outputs: "github-actions[bot]"
 *   // Outputs: "my-github-app"
 * }
 * ```
 *
 * @param options - Optional CI detection options
 * @returns The username of the actor who triggered the workflow, or `undefined`
 *          if not running in GitHub Actions or if the variable is not set
 */
export function getGithubActor(
  options?: CIDetectionOptions,
): string | undefined {
  const env = getEnv(options);
  return env["GITHUB_ACTOR"];
}

/**
 * Gets the account ID of the person or app that triggered the initial workflow run.
 *
 * This environment variable contains the unique numeric account ID of the actor.
 * Note that this is different from the actor username (GITHUB_ACTOR).
 *
 * @example
 * ```typescript
 * const actorId = getGithubActorId();
 * if (actorId) {
 *   console.log(`Actor ID: ${actorId}`);
 *   // Outputs: "1234567"
 *   // Outputs: "9876543"
 * }
 * ```
 *
 * @param options - Optional CI detection options
 * @returns The numeric account ID of the actor as a string, or `undefined`
 *          if not running in GitHub Actions or if the variable is not set
 */
export function getGithubActorId(
  options?: CIDetectionOptions,
): string | undefined {
  const env = getEnv(options);
  return env["GITHUB_ACTOR_ID"];
}

/**
 * Gets the GitHub API URL.
 *
 * This environment variable returns the base URL for the GitHub API.
 * For GitHub.com, this is https://api.github.com. For GitHub Enterprise Server,
 * this will be the API URL of the enterprise instance.
 *
 * @see {https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/store-information-in-variables#default-environment-variables}
 *
 * @example
 * ```typescript
 * const apiUrl = getGithubApiUrl();
 * if (apiUrl) {
 *   console.log(`GitHub API: ${apiUrl}`);
 *   // Outputs: "https://api.github.com"
 *   // Outputs: "https://github.my-enterprise.com/api/v3"
 * }
 * ```
 *
 * @param options - Optional CI detection options
 * @returns The GitHub API URL, or `undefined` if not running in GitHub Actions
 *          or if the variable is not set
 */
export function getGithubApiUrl(
  options?: CIDetectionOptions,
): string | undefined {
  const env = getEnv(options);
  return env["GITHUB_API_URL"];
}
