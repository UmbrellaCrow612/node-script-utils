import type { CIDetectionOptions } from "./ci.js";

/**
 * Helper to get environment object (cached pattern)
 */
export function getEnv(options?: CIDetectionOptions): NodeJS.ProcessEnv {
  return options?.env ?? process.env;
}
