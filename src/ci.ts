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