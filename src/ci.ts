/**
 * CI/CD Environment Detection Utilities
 *
 * Provides type-safe helpers for detecting and interacting with various
 * Continuous Integration platforms including GitHub Actions, GitLab CI,
 * CircleCI, Travis CI, Jenkins, Azure Pipelines, and more.
 */

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Supported CI platform identifiers
 */
export type CIPlatform =
  | "github-actions"
  | "gitlab-ci"
  | "circleci"
  | "travis"
  | "jenkins"
  | "azure-pipelines"
  | "bitbucket-pipelines"
  | "drone"
  | "buildkite"
  | "semaphore"
  | "teamcity"
  | "bamboo"
  | "appveyor"
  | "wercker"
  | "codeship"
  | "netlify"
  | "vercel"
  | "aws-codebuild"
  | "gcp-cloud-build"
  | "unknown";

/**
 * Options for CI detection utilities
 */
export type CIDetectionOptions = {
  /**
   * Allow override detection for testing purposes
   */
  env?: Record<string, string | undefined>;

  /**
   * Strict mode - only return true if absolutely certain
   */
  strict?: boolean;
};

// ============================================================================
// Platform Detection Utilities
// ============================================================================

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
  const env = options?.env ?? process.env;
  return env["GITHUB_ACTIONS"] === "true";
}

/**
 * Detects if running inside GitLab CI
 *
 * GitLab CI sets `GITLAB_CI` environment variable
 */
export function isInsideGitLabCI(options?: CIDetectionOptions): boolean {
  const env = options?.env ?? process.env;
  return env["GITLAB_CI"] === "true";
}

/**
 * Detects if running inside CircleCI
 *
 * CircleCI sets `CIRCLECI` environment variable
 */
export function isInsideCircleCI(options?: CIDetectionOptions): boolean {
  const env = options?.env ?? process.env;
  return env["CIRCLECI"] === "true";
}

/**
 * Detects if running inside Travis CI
 *
 * Travis CI sets `TRAVIS` environment variable
 */
export function isInsideTravis(options?: CIDetectionOptions): boolean {
  const env = options?.env ?? process.env;
  return env["TRAVIS"] === "true";
}

/**
 * Detects if running inside Jenkins
 *
 * Jenkins sets `JENKINS_URL` or `JENKINS_HOME` environment variables.
 * In strict mode, requires `BUILD_NUMBER` or `BUILD_ID` to avoid false positives
 * from local Jenkins installations.
 */
export function isInsideJenkins(options?: CIDetectionOptions): boolean {
  const env = options?.env ?? process.env;
  const hasJenkinsEnv = !!(env["JENKINS_URL"] || env["JENKINS_HOME"]);

  if (options?.strict) {
    return hasJenkinsEnv && !!(env["BUILD_NUMBER"] || env["BUILD_ID"]);
  }

  return hasJenkinsEnv;
}

/**
 * Detects if running inside Azure Pipelines
 *
 * Azure Pipelines sets `TF_BUILD` environment variable to "True"
 */
export function isInsideAzurePipelines(options?: CIDetectionOptions): boolean {
  const env = options?.env ?? process.env;
  return env["TF_BUILD"] === "True";
}

/**
 * Detects if running inside Bitbucket Pipelines
 *
 * Bitbucket sets `BITBUCKET_PIPELINE_UUID` environment variable
 */
export function isInsideBitbucketPipelines(
  options?: CIDetectionOptions,
): boolean {
  const env = options?.env ?? process.env;
  return !!env["BITBUCKET_PIPELINE_UUID"];
}

/**
 * Detects if running inside Drone CI
 *
 * Drone sets `DRONE` environment variable to "true"
 */
export function isInsideDrone(options?: CIDetectionOptions): boolean {
  const env = options?.env ?? process.env;
  return env["DRONE"] === "true";
}

/**
 * Detects if running inside Buildkite
 *
 * Buildkite sets `BUILDKITE` environment variable to "true"
 */
export function isInsideBuildkite(options?: CIDetectionOptions): boolean {
  const env = options?.env ?? process.env;
  return env["BUILDKITE"] === "true";
}

/**
 * Detects if running inside Semaphore CI
 *
 * Semaphore 2.0 sets `SEMAPHORE_WORKFLOW_ID` or `SEMAPHORE_PIPELINE_ID`.
 * Legacy Semaphore sets `SEMAPHORE`.
 */
export function isInsideSemaphore(options?: CIDetectionOptions): boolean {
  const env = options?.env ?? process.env;
  return !!(
    env["SEMAPHORE"] ||
    env["SEMAPHORE_WORKFLOW_ID"] ||
    env["SEMAPHORE_PIPELINE_ID"]
  );
}

/**
 * Detects if running inside TeamCity
 *
 * TeamCity sets `TEAMCITY_VERSION` environment variable
 */
export function isInsideTeamCity(options?: CIDetectionOptions): boolean {
  const env = options?.env ?? process.env;
  return !!env["TEAMCITY_VERSION"];
}

/**
 * Detects if running inside Bamboo
 *
 * Bamboo sets `bamboo_planKey` environment variable
 */
export function isInsideBamboo(options?: CIDetectionOptions): boolean {
  const env = options?.env ?? process.env;
  return !!env["bamboo_planKey"];
}

/**
 * Detects if running inside AppVeyor
 *
 * AppVeyor sets `APPVEYOR` environment variable
 */
export function isInsideAppVeyor(options?: CIDetectionOptions): boolean {
  const env = options?.env ?? process.env;
  return env["APPVEYOR"] === "true" || env["APPVEYOR"] === "True";
}

/**
 * Detects if running inside Wercker
 *
 * Wercker sets `WERCKER` environment variable
 */
export function isInsideWercker(options?: CIDetectionOptions): boolean {
  const env = options?.env ?? process.env;
  return !!env["WERCKER"];
}

/**
 * Detects if running inside Codeship
 *
 * Codeship sets `CODESHIP` environment variable to "true"
 */
export function isInsideCodeship(options?: CIDetectionOptions): boolean {
  const env = options?.env ?? process.env;
  return env["CODESHIP"] === "true";
}

/**
 * Detects if running inside Netlify
 *
 * Netlify sets `NETLIFY` environment variable
 */
export function isInsideNetlify(options?: CIDetectionOptions): boolean {
  const env = options?.env ?? process.env;
  return !!env["NETLIFY"];
}

/**
 * Detects if running inside Vercel
 *
 * Vercel sets `VERCEL` or `NOW` (legacy) environment variables
 */
export function isInsideVercel(options?: CIDetectionOptions): boolean {
  const env = options?.env ?? process.env;
  return !!(env["VERCEL"] || env["NOW"]);
}

/**
 * Detects if running inside AWS CodeBuild
 *
 * AWS CodeBuild sets `CODEBUILD_BUILD_ID` environment variable
 */
export function isInsideAWSCodeBuild(options?: CIDetectionOptions): boolean {
  const env = options?.env ?? process.env;
  return !!env["CODEBUILD_BUILD_ID"];
}

/**
 * Detects if running inside GCP Cloud Build
 *
 * GCP Cloud Build sets `CLOUD_BUILD_ID` environment variable
 */
export function isInsideGCPCloudBuild(options?: CIDetectionOptions): boolean {
  const env = options?.env ?? process.env;
  return !!env["CLOUD_BUILD_ID"];
}

/**
 * Detects if running inside any CI environment
 *
 * Checks for generic CI environment variable or any known platform
 */
export function isInsideCI(options?: CIDetectionOptions): boolean {
  const env = options?.env ?? process.env;

  // Generic CI detection
  if (env["CI"] === "true" || env["CI"] === "1") return true;

  // Check all known platforms using dedicated functions
  return (
    isInsideGithubAction(options) ||
    isInsideGitLabCI(options) ||
    isInsideCircleCI(options) ||
    isInsideTravis(options) ||
    isInsideJenkins(options) ||
    isInsideAzurePipelines(options) ||
    isInsideBitbucketPipelines(options) ||
    isInsideDrone(options) ||
    isInsideBuildkite(options) ||
    isInsideSemaphore(options) ||
    isInsideTeamCity(options) ||
    isInsideBamboo(options) ||
    isInsideAppVeyor(options) ||
    isInsideWercker(options) ||
    isInsideCodeship(options) ||
    isInsideNetlify(options) ||
    isInsideVercel(options) ||
    isInsideAWSCodeBuild(options) ||
    isInsideGCPCloudBuild(options) ||
    !!env["CI_NAME"] // Generic CI name fallback
  );
}

// ============================================================================
// Platform Identification
// ============================================================================

/**
 * Identifies the specific CI platform being used
 *
 * @returns The detected CI platform or "unknown"
 *
 * @example
 * ```typescript
 * const platform = getCIPlatform();
 * if (platform === "github-actions") {
 *   // Use GitHub Actions specific features
 * }
 * ```
 */
export function getCIPlatform(options?: CIDetectionOptions): CIPlatform {
  if (isInsideGithubAction(options)) return "github-actions";
  if (isInsideGitLabCI(options)) return "gitlab-ci";
  if (isInsideCircleCI(options)) return "circleci";
  if (isInsideTravis(options)) return "travis";
  if (isInsideJenkins(options)) return "jenkins";
  if (isInsideAzurePipelines(options)) return "azure-pipelines";
  if (isInsideBitbucketPipelines(options)) return "bitbucket-pipelines";
  if (isInsideDrone(options)) return "drone";
  if (isInsideBuildkite(options)) return "buildkite";
  if (isInsideSemaphore(options)) return "semaphore";
  if (isInsideTeamCity(options)) return "teamcity";
  if (isInsideBamboo(options)) return "bamboo";
  if (isInsideAppVeyor(options)) return "appveyor";
  if (isInsideWercker(options)) return "wercker";
  if (isInsideCodeship(options)) return "codeship";
  if (isInsideNetlify(options)) return "netlify";
  if (isInsideVercel(options)) return "vercel";
  if (isInsideAWSCodeBuild(options)) return "aws-codebuild";
  if (isInsideGCPCloudBuild(options)) return "gcp-cloud-build";

  // Handle generic CI_NAME as fallback
  const env = options?.env ?? process.env;
  if (env["CI_NAME"]) {
    const normalizedName = env["CI_NAME"].toLowerCase().replace(/\s+/g, "-");
    // Validate against known platforms or return as-is if unknown
    const knownPlatforms: CIPlatform[] = [
      "github-actions",
      "gitlab-ci",
      "circleci",
      "travis",
      "jenkins",
      "azure-pipelines",
      "bitbucket-pipelines",
      "drone",
      "buildkite",
      "semaphore",
      "teamcity",
      "bamboo",
      "appveyor",
      "wercker",
      "codeship",
      "netlify",
      "vercel",
      "aws-codebuild",
      "gcp-cloud-build",
    ];
    return knownPlatforms.includes(normalizedName as CIPlatform)
      ? (normalizedName as CIPlatform)
      : "unknown";
  }

  return "unknown";
}
