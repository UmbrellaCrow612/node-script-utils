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

/**
 * Gets the name of the base ref or target branch of the pull request in a workflow run.
 *
 * This is only set when the event that triggers a workflow run is either
 * `pull_request` or `pull_request_target`. For example, `main`.
 *
 * @example
 * ```typescript
 * const baseRef = getGithubBaseRef();
 * if (baseRef) {
 *   console.log(`Target branch: ${baseRef}`);
 *   // Outputs: "main"
 *   // Outputs: "develop"
 * }
 * ```
 *
 * @param options - Optional CI detection options
 * @returns The base ref or target branch name, or `undefined` if not running in
 *          GitHub Actions, not in a pull request event, or if the variable is not set
 */
export function getGithubBaseRef(
  options?: CIDetectionOptions,
): string | undefined {
  const env = getEnv(options);
  return env["GITHUB_BASE_REF"];
}

/**
 * Gets the path on the runner to the file that sets variables from workflow commands.
 *
 * The path to this file is unique to the current step and changes for each step
 * in a job. This file is used to set environment variables that can be passed
 * to subsequent steps in the workflow.
 *
 * @example
 * ```typescript
 * const envFilePath = getGithubEnv();
 * if (envFilePath) {
 *   console.log(`Env file: ${envFilePath}`);
 *   // Outputs: "/home/runner/work/_temp/_runner_file_commands/set_env_87406d6e-4979-4d42-98e1-3dab1f48b13a"
 * }
 * ```
 *
 * @param options - Optional CI detection options
 * @returns The path to the environment file, or `undefined` if not running in
 *          GitHub Actions or if the variable is not set
 */
export function getGithubEnv(options?: CIDetectionOptions): string | undefined {
  const env = getEnv(options);
  return env["GITHUB_ENV"];
}

/**
 * All possible event names that can trigger a GitHub Actions workflow.
 *
 * @see {https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows}
 */
export type GithubEventName =
  | "push"
  | "pull_request"
  | "pull_request_target"
  | "workflow_dispatch"
  | "schedule"
  | "release"
  | "issue_comment"
  | "issues"
  | "create"
  | "delete"
  | "fork"
  | "star"
  | "watch"
  | "workflow_run"
  | "workflow_call"
  | "check_run"
  | "check_suite"
  | "deployment"
  | "deployment_status"
  | "discussion"
  | "merge_group"
  | "gollum"
  | "label"
  | "milestone"
  | "page_build"
  | "public"
  | "registry_package"
  | "repository_dispatch"
  | "status"
  | "branch_protection_rule"
  | "secret_scanning_alert"
  | "dependabot_alert"
  | "merge_queue"
  | "projects"
  | "project_card"
  | "project_column"
  | "auto_merge_enabled"
  | "auto_merge_disabled"
  | "pull_request_review"
  | "pull_request_review_comment"
  | "pull_request_review_thread"
  | "code_scanning_alert"
  | "commit_comment"
  | "member"
  | "membership"
  | "team_add"
  | "repository"
  | "organization"
  | "org_block"
  | "sponsorship"
  | "meta"
  | "transfers"
  | "ping";

/**
 * Gets the name of the event that triggered the workflow.
 *
 * Common event names include:
 * - `push` - When commits are pushed to a branch or tag
 * - `pull_request` - When a pull request is opened, synchronized, or closed
 * - `pull_request_target` - When a PR targets the base repository (runs in base context)
 * - `workflow_dispatch` - When manually triggered via GitHub UI, CLI, or API
 * - `schedule` - When triggered by a cron schedule
 * - `release` - When a release is published, edited, or deleted
 * - `issue_comment` - When a comment is added to an issue or pull request
 * - `issues` - When an issue is opened, edited, labeled, or closed
 * - `create` - When a branch or tag is created
 * - `delete` - When a branch or tag is deleted
 * - `fork` - When a repository is forked
 * - `star` - When a repository is starred
 * - `watch` - When someone starts watching a repository
 * - `workflow_run` - When another workflow completes
 * - `workflow_call` - When a reusable workflow is called
 * - `check_run` - When a check run is created or completed
 * - `check_suite` - When a check suite is completed
 * - `deployment` - When a deployment is created
 * - `deployment_status` - When a deployment status changes
 * - `discussion` - When a discussion is created or modified
 * - `merge_group` - When a pull request is added to a merge queue
 * - `gollum` - When a wiki page is created or updated
 * - `label` - When a label is created, edited, or deleted
 * - `milestone` - When a milestone is created or closed
 * - `page_build` - When a GitHub Pages site is built
 * - `public` - When a repository is made public
 * - `registry_package` - When a package is published or updated
 * - `repository_dispatch` - When triggered via REST API
 * - `status` - When a commit status changes
 * - `branch_protection_rule` - When branch protection rules change
 * - `secret_scanning_alert` - When a secret is detected in the repository
 *
 * @example
 * ```typescript
 * const eventName = getGithubEventName();
 * if (eventName === "pull_request") {
 *   console.log("Processing PR");
 * } else if (eventName === "push") {
 *   console.log("Processing push");
 * }
 * ```
 *
 * @param options - Optional CI detection options
 * @returns The name of the triggering event, or `undefined` if not running in
 *          GitHub Actions or if the variable is not set
 */
export function getGithubEventName(
  options?: CIDetectionOptions,
): GithubEventName | undefined {
  const env = getEnv(options);
  return env["GITHUB_EVENT_NAME"] as GithubEventName | undefined;
}

/**
 * Gets the path to the file on the runner that contains the full event webhook payload.
 *
 * This JSON file contains the complete webhook payload that triggered the workflow.
 * You can read and parse this file to access detailed information about the event.
 *
 * @example
 * ```typescript
 * import { readFileSync } from "fs";
 *
 * const eventPath = getGithubEventPath();
 * if (eventPath) {
 *   const eventPayload = JSON.parse(readFileSync(eventPath, "utf8"));
 *   console.log("Event payload:", eventPayload);
 *   // Access specific properties like:
 *   // eventPayload.pull_request.number
 *   // eventPayload.repository.full_name
 * }
 * ```
 *
 * @param options - Optional CI detection options
 * @returns The path to the event payload JSON file, or `undefined` if not running
 *          in GitHub Actions or if the variable is not set
 */
export function getGithubEventPath(
  options?: CIDetectionOptions,
): string | undefined {
  const env = getEnv(options);
  return env["GITHUB_EVENT_PATH"];
}

/**
 * Gets the GitHub GraphQL API URL.
 *
 * This environment variable returns the base URL for the GitHub GraphQL API.
 * For GitHub.com, this is https://api.github.com/graphql. For GitHub Enterprise Server,
 * this will be the GraphQL API URL of the enterprise instance.
 *
 * @example
 * ```typescript
 * const graphqlUrl = getGithubGraphqlUrl();
 * if (graphqlUrl) {
 *   console.log(`GitHub GraphQL API: ${graphqlUrl}`);
 *   // Outputs: "https://api.github.com/graphql"
 *   // Outputs: "https://github.my-enterprise.com/api/graphql"
 * }
 * ```
 *
 * @param options - Optional CI detection options
 * @returns The GitHub GraphQL API URL, or `undefined` if not running in GitHub Actions
 *          or if the variable is not set
 */
export function getGithubGraphqlUrl(
  options?: CIDetectionOptions,
): string | undefined {
  const env = getEnv(options);
  return env["GITHUB_GRAPHQL_URL"];
}

/**
 * Gets the head ref or source branch of the pull request in a workflow run.
 *
 * GitHub Actions sets the `GITHUB_HEAD_REF` environment variable which contains:
 * - The source branch name for pull request events (e.g., "feature-branch-1")
 * - Only set when the triggering event is `pull_request` or `pull_request_target`
 * - Empty or undefined for other event types (push, release, etc.)
 *
 * @example
 * ```typescript
 * const headRef = getGithubHeadRef();
 * if (headRef) {
 *   console.log(`Pull request source branch: ${headRef}`);
 *   // Outputs: "feature-branch-1"
 * }
 * ```
 *
 * @example
 * ```typescript
 * // In a pull request workflow
 * const sourceBranch = getGithubHeadRef();
 * const targetBranch = getGithubBaseRef();
 * console.log(`Merging ${sourceBranch} into ${targetBranch}`);
 * // Outputs: "Merging feature-branch-1 into main"
 * ```
 *
 * @param options - Optional CI detection options
 * @returns The head ref/source branch name, or `undefined` if not running in GitHub Actions,
 *          not a pull request event, or if the variable is not set
 */
export function getGithubHeadRef(
  options?: CIDetectionOptions,
): string | undefined {
  const env = getEnv(options);
  return env["GITHUB_HEAD_REF"];
}

/**
 * Gets the job_id of the current job running in GitHub Actions.
 *
 * GitHub Actions sets the `GITHUB_JOB` environment variable which contains:
 * - The identifier of the current job as defined in the workflow YAML (e.g., "greeting_job")
 * - Useful for logging, debugging, or conditionally executing logic based on specific jobs
 * - Consistent across all job steps within the same job execution
 *
 * @example
 * ```typescript
 * const jobId = getGithubJob();
 * if (jobId) {
 *   console.log(`Current job: ${jobId}`);
 *   // Outputs: "greeting_job"
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Conditional logic based on job ID
 * const currentJob = getGithubJob();
 * if (currentJob === "build_job") {
 *   await runBuildSteps();
 * } else if (currentJob === "test_job") {
 *   await runTestSteps();
 * }
 * ```
 *
 * @param options - Optional CI detection options
 * @returns The job_id of the current job, or `undefined` if not running in GitHub Actions
 *          or if the variable is not set
 */
export function getGithubJob(options?: CIDetectionOptions): string | undefined {
  const env = getEnv(options);
  return env["GITHUB_JOB"];
}

/**
 * Gets the path to the file used for setting the current step's outputs via workflow commands.
 *
 * GitHub Actions sets the `GITHUB_OUTPUT` environment variable which contains:
 * - The absolute path to a unique file for the current step (e.g., "/home/runner/work/_temp/_runner_file_commands/set_output_a50ef383-b063-46d9-9157-57953fc9f3f0")
 * - The path is unique to each step and changes for every step in a job
 * - Used to share data between steps by writing key-value pairs in the format `key=value` to this file
 * - Replaces the deprecated `::set-output::` workflow command for setting outputs
 *
 * @example
 * ```typescript
 * import { writeFileSync } from "fs";
 *
 * const outputFile = getGithubOutput();
 * if (outputFile) {
 *   // Set an output variable for subsequent steps
 *   writeFileSync(outputFile, "result=success\n", { flag: "a" });
 *   writeFileSync(outputFile, "version=1.2.3\n", { flag: "a" });
 * }
 * ```
 *
 * @example
 * ```typescript
 * import { appendFileSync } from "fs";
 *
 * // Set multiple outputs for use in subsequent steps
 * const setOutput = (name: string, value: string) => {
 *   const file = getGithubOutput();
 *   if (file) {
 *     appendFileSync(file, `${name}=${value}\n`);
 *   }
 * };
 *
 * setOutput("build_status", "passed");
 * setOutput("artifact_path", "/dist/app.zip");
 * ```
 *
 * @param options - Optional CI detection options
 * @returns The path to the step's output file, or `undefined` if not running in GitHub Actions
 *          or if the variable is not set
 */
export function getGithubOutput(
  options?: CIDetectionOptions,
): string | undefined {
  const env = getEnv(options);
  return env["GITHUB_OUTPUT"];
}

/**
 * Gets the path to the file used for adding system PATH entries via workflow commands.
 *
 * GitHub Actions sets the `GITHUB_PATH` environment variable which contains:
 * - The absolute path to a unique file for the current step (e.g., "/home/runner/work/_temp/_runner_file_commands/add_path_899b9445-ad4a-400c-aa89-249f18632cf5")
 * - The path is unique to each step and changes for every step in a job
 * - Used to prepend directories to the system PATH for subsequent steps in the job
 * - Write directory paths to this file, one per line, to make executables available to later steps
 * - Replaces the deprecated `::add-path::` workflow command
 *
 * @see {@link https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#adding-a-system-path}
 *
 * @example
 * ```typescript
 * import { appendFileSync } from "fs";
 *
 * const pathFile = getGithubPath();
 * if (pathFile) {
 *   // Add a directory to PATH for subsequent steps
 *   appendFileSync(pathFile, "/opt/my-tool/bin\n");
 * }
 * ```
 *
 * @example
 * ```typescript
 * import { appendFileSync } from "fs";
 * import { join } from "path";
 *
 * // Add multiple directories to PATH
 * const addToPath = (...dirs: string[]) => {
 *   const file = getGithubPath();
 *   if (file) {
 *     dirs.forEach(dir => appendFileSync(file, `${dir}\n`));
 *   }
 * };
 *
 * addToPath(
 *   join(process.cwd(), "node_modules/.bin"),
 *   "/usr/local/custom-tools"
 * );
 * ```
 *
 * @param options - Optional CI detection options
 * @returns The path to the step's PATH file, or `undefined` if not running in GitHub Actions
 *          or if the variable is not set
 */
export function getGithubPath(
  options?: CIDetectionOptions,
): string | undefined {
  const env = getEnv(options);
  return env["GITHUB_PATH"];
}

/**
 * Gets the fully-formed ref of the branch or tag that triggered the workflow run.
 *
 * GitHub Actions sets the `GITHUB_REF` environment variable which contains:
 * - For push events: `refs/heads/<branch_name>` or `refs/tags/<tag_name>`
 * - For pull_request events (not merged): `refs/pull/<pr_number>/merge`
 * - For pull_request events (merged): `refs/heads/<head_branch>`
 * - For pull_request_target events: ref from the base branch (e.g., `refs/heads/main`)
 * - For release events: `refs/tags/<tag_name>`
 * - Only set if a branch or tag is available for the event type
 *
 * Format variations:
 * - Branches: `refs/heads/<branch_name>` (e.g., "refs/heads/feature-branch-1")
 * - Tags: `refs/tags/<tag_name>` (e.g., "refs/tags/v1.0.0")
 * - Pull requests: `refs/pull/<pr_number>/merge` (e.g., "refs/pull/42/merge")
 *
 * @example
 * ```typescript
 * const ref = getGithubRef();
 * if (ref) {
 *   console.log(`Triggered by: ${ref}`);
 *   // Outputs: "refs/heads/feature-branch-1"
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Extract branch or tag name from the ref
 * const ref = getGithubRef();
 * if (ref?.startsWith("refs/heads/")) {
 *   const branchName = ref.replace("refs/heads/", "");
 *   console.log(`Branch: ${branchName}`);
 *   // Outputs: "feature-branch-1"
 * } else if (ref?.startsWith("refs/tags/")) {
 *   const tagName = ref.replace("refs/tags/", "");
 *   console.log(`Tag: ${tagName}`);
 *   // Outputs: "v1.0.0"
 * } else if (ref?.startsWith("refs/pull/")) {
 *   console.log("Running in a pull request context");
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Determine event type from ref pattern
 * const ref = getGithubRef();
 * const isTag = ref?.startsWith("refs/tags/");
 * const isBranch = ref?.startsWith("refs/heads/");
 * const isPullRequest = ref?.startsWith("refs/pull/");
 *
 * if (isTag) {
 *   await deployToProduction();
 * } else if (isBranch) {
 *   await runTests();
 * }
 * ```
 *
 * @param options - Optional CI detection options
 * @returns The fully-formed ref string, or `undefined` if not running in GitHub Actions,
 *          if no branch/tag is available for the event type, or if the variable is not set
 */
export function getGithubRef(options?: CIDetectionOptions): string | undefined {
  const env = getEnv(options);
  return env["GITHUB_REF"];
}

/**
 * Gets the short ref name of the branch or tag that triggered the workflow run.
 *
 * GitHub Actions sets the `GITHUB_REF_NAME` environment variable which contains:
 * - The human-readable branch or tag name as shown on GitHub (e.g., "feature-branch-1", "v1.0.0")
 * - For unmerged pull requests: `<pr_number>/merge` (e.g., "42/merge")
 * - The short version of `GITHUB_REF` without the `refs/heads/`, `refs/tags/`, or `refs/pull/` prefix
 * - Useful for display purposes, constructing URLs, or referencing resources by simple name
 *
 * @example
 * ```typescript
 * const refName = getGithubRefName();
 * if (refName) {
 *   console.log(`Running on: ${refName}`);
 *   // Outputs: "feature-branch-1"
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Use in deployment naming or artifact versioning
 * const refName = getGithubRefName();
 * if (refName) {
 *   const sanitized = refName.replace(/[^a-zA-Z0-9-]/g, "-");
 *   const artifactName = `app-${sanitized}.zip`;
 *   console.log(`Creating artifact: ${artifactName}`);
 *   // Outputs: "app-feature-branch-1.zip" or "app-42-merge.zip"
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Detect if running on a pull request merge branch
 * const refName = getGithubRefName();
 * if (refName?.includes("/merge")) {
 *   const prNumber = refName.split("/")[0];
 *   console.log(`Testing PR #${prNumber} merge commit`);
 *   // Outputs: "Testing PR #42 merge commit"
 * }
 * ```
 *
 * @param options - Optional CI detection options
 * @returns The short ref name, or `undefined` if not running in GitHub Actions
 *          or if the variable is not set
 */
export function getGithubRefName(
  options?: CIDetectionOptions,
): string | undefined {
  const env = getEnv(options);
  return env["GITHUB_REF_NAME"];
}

/**
 * Checks if the Git ref that triggered the workflow has branch protections or rulesets configured.
 *
 * GitHub Actions sets the `GITHUB_REF_PROTECTED` environment variable to "true" when
 * the branch or tag that triggered the workflow has protections enabled (branch protection
 * rules or rulesets). Returns "false" or is unset if no protections are configured.
 *
 * @example
 * ```typescript
 * if (isRefProtected()) {
 *   console.log("Running on a protected branch - extra safeguards active");
 *   // Require additional approvals, skip destructive operations, etc.
 * } else {
 *   console.log("No branch protections detected");
 * }
 * ```
 *
 * @example
 * ```typescript
 * const isProtected = isRefProtected();
 * const deploymentTarget = isProtected ? "production" : "staging";
 * // Route protected branch deployments to production environment
 * ```
 *
 * @param options - Optional CI detection options
 * @returns `true` if the ref has protections/rulesets, `false` if not or if not running in GitHub Actions
 */
export function isRefProtected(options?: CIDetectionOptions): boolean {
  const env = getEnv(options);
  return env["GITHUB_REF_PROTECTED"] === "true";
}

/**
 * Gets the type of Git ref that triggered the workflow run.
 *
 * GitHub Actions sets the `GITHUB_REF_TYPE` environment variable to indicate whether
 * the workflow was triggered by a branch push or a tag push. Valid values are "branch" or "tag".
 *
 * @example
 * ```typescript
 * const refType = getGithubRefType();
 * if (refType === "branch") {
 *   console.log("Triggered by branch push");
 *   // Run branch-specific logic
 * } else if (refType === "tag") {
 *   console.log("Triggered by tag push");
 *   // Run release/tag-specific logic
 * }
 * ```
 *
 * @example
 * ```typescript
 * const refType = getGithubRefType();
 * const version = refType === "tag" ? getGithubRef()?.replace("refs/tags/", "") : "dev";
 * // Use tag name as version, fallback to "dev" for branch triggers
 * ```
 *
 * @param options - Optional CI detection options
 * @returns "branch" | "tag" | `undefined` if not running in GitHub Actions or if the variable is not set
 */
export function getGithubRefType(
  options?: CIDetectionOptions,
): "branch" | "tag" | undefined {
  const env = getEnv(options);
  const refType = env["GITHUB_REF_TYPE"];
  if (refType === "branch" || refType === "tag") {
    return refType;
  }
  return undefined;
}

/**
 * Gets the owner and repository name for the workflow run.
 *
 * GitHub Actions sets the `GITHUB_REPOSITORY` environment variable to the full
 * repository identifier in the format `owner/repo-name` (e.g., "octocat/Hello-World").
 *
 * @example
 * ```typescript
 * const repo = getGithubRepository();
 * if (repo) {
 *   console.log(repo.owner, repo.name);
 *   // "octocat", "Hello-World"
 * }
 * ```
 *
 * @example
 * ```typescript
 * const repo = getGithubRepository();
 * const apiUrl = repo
 *   ? `https://api.github.com/repos/${repo.owner}/${repo.name}/issues`
 *   : undefined;
 * ```
 *
 * @param options - Optional CI detection options
 * @returns `{ owner, name }` or `undefined` if not running in GitHub Actions
 */
export function getGithubRepository(
  options?: CIDetectionOptions,
): { owner: string; name: string } | undefined {
  const env = getEnv(options);
  const raw = env["GITHUB_REPOSITORY"];

  if (!raw) return undefined;

  const [owner, name] = raw.split("/");
  if (!owner || !name) return undefined;

  return { owner, name };
}
