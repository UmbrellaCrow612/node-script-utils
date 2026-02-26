/**
 * Callback that can return nothing or a promise to await
 */
export type PromisableCallback = () => void | Promise<void>;

/**
 * Error-aware callback that receives the error that caused the failure
 */
export type ErrorCallback = (error: Error) => void | Promise<void>;

/**
 * Additional options to change the behaviour of safe run
 */
export type SafeRunOptions = {
  /**
   * Run custom logic when the main callback operation fails (i.e., throws an error).
   * Receives the error that caused the failure.
   */
  onFail?: ErrorCallback;

  /**
   * Run custom logic before the main callback in safeRun is run.
   */
  onBefore?: PromisableCallback;

  /**
   * Run custom logic after the main callback operation has run without throwing an error.
   */
  onAfter?: PromisableCallback;

  /**
   * Whether to end the process if the main callback throws an error.
   */
  exitOnFailed?: boolean;

  /**
   * Custom exit code to provide to the process should you choose to exit.
   */
  exitFailCode?: number;

  /**
   * Timeout in milliseconds for the main callback execution.
   * If the callback exceeds this time, it will be aborted with a TimeoutError.
   */
  timeoutMs?: number;
};

/**
 * Custom error class for timeout scenarios
 */
export class TimeoutError extends Error {
  constructor(
    message: string,
    public readonly timeoutMs: number,
  ) {
    super(message);
    this.name = "TimeoutError";
  }
}

/**
 * Creates a timeout promise that rejects after specified milliseconds
 * Returns both the promise and a cleanup function to clear the timeout
 */
function createTimeoutPromise(ms: number): {
  timeoutPromise: Promise<any>;
  clear: () => void;
} {
  let timeoutId: ReturnType<typeof setTimeout>;
  let _resolve: (value: unknown) => void;

  const timeoutPromise = new Promise((resolve, reject) => {
    _resolve = resolve;
    timeoutId = setTimeout(() => {
      reject(new TimeoutError(`Operation timed out after ${ms}ms`, ms));
    }, ms);
  });

  const clear = () => {
    clearTimeout(timeoutId);
    _resolve(true);
  };

  return { timeoutPromise, clear };
}

/**
 * Safely executes an asynchronous callback with lifecycle hooks and error handling.
 *
 * Provides a structured way to run async operations with optional hooks for
 * setup (onBefore), success (onAfter), failure (onFail), and cleanup (onLast).
 * Supports optional process exit on failure with configurable exit codes.
 * Includes timeout support and robust error handling for all hooks.
 *
 * @param callback - The main async function to execute safely
 * @param options - Configuration options for lifecycle hooks and error handling
 * @returns A promise that resolves when execution completes, or rejects if the callback fails
 * @throws Re-throws the original error if `exitOnFailed` is false and the callback fails
 * @throws TimeoutError if the operation exceeds the configured timeout
 *
 * @example
 * ```typescript
 * await safeRun(
 *   async () => {
 *     await performRiskyOperation();
 *   },
 *   {
 *     onBefore: () => console.log('Starting...'),
 *     onAfter: () => console.log('Success!'),
 *     onFail: (err) => console.log('Failed:', err.message),
 *     exitOnFailed: true,
 *     exitFailCode: 1,
 *     timeoutMs: 5000
 *   }
 * );
 * ```
 */
export async function safeRun(
  callback: PromisableCallback,
  options: SafeRunOptions = {},
): Promise<void> {
  const {
    onBefore,
    onAfter,
    onFail,
    exitOnFailed = false,
    exitFailCode = 1,
    timeoutMs,
  } = options;

  let mainError: Error | null = null;

  try {
    if (onBefore) {
      await onBefore();
    }

    if (timeoutMs && timeoutMs > 0) {
      const { timeoutPromise, clear } = createTimeoutPromise(timeoutMs);

      try {
        await Promise.race([callback(), timeoutPromise]);
      } finally {
        clear();
      }
    } else {
      await callback();
    }

    // Run after hook on success
    if (onAfter) {
      await onAfter();
    }
  } catch (error) {
    mainError = error instanceof Error ? error : new Error(String(error));

    // Run fail hook with error context
    if (onFail) {
      await onFail(mainError);
    }

    // Exit process if configured to do so
    if (exitOnFailed) {
      process.exit(exitFailCode);
    }

    // Re-throw the error so caller can handle it if process doesn't exit
    throw mainError;
  }
}
