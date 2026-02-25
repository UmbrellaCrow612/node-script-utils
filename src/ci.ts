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
