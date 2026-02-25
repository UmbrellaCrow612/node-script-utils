/**
 * GitHub Actions Specific Helpers
 * @see {https://docs.github.com/en/actions/reference/security/secure-use}
 */

import type { CIDetectionOptions } from "./ci.js";
import { getEnv } from "./env.js";

/**
 * Gets the GitHub token for authentication.
 *
 * Automatically provided to workflows, useful for API calls.
 */
export function getGithubToken(
  options?: CIDetectionOptions,
): string | undefined {
  const env = getEnv(options);
  return env["GITHUB_TOKEN"];
}
