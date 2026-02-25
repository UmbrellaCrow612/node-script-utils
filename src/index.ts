export * from "./ci.js";
export * from "./command.js";
export * from "./github-ci.js";

/**
 * Callback that can return nothing or a promise to await
 */
export type PromisableCallback = () => void | Promise<void>;

/**
 * Error-aware callback that receives the error that caused the failure
 */
export type ErrorCallback = (error: Error) => void | Promise<void>;

/**
 * Type-safe exit codes following Unix conventions
 * - 0: Success
 * - 1: General error
 * - 2: Misuse of shell builtins
 * - 126: Command invoked cannot execute
 * - 127: Command not found
 * - 128+n: Fatal error signal "n"
 * - 130: Script terminated by Ctrl+C
 * - 255: Exit status out of range
 */
export type ExitCode =
  | 0
  | 1
  | 2
  | 126
  | 127
  | 128
  | 129
  | 130
  | 131
  | 132
  | 133
  | 134
  | 135
  | 136
  | 137
  | 255
  | (number & { __brand: "ExitCode" });

/**
 * Additional options to change the behaviour of safe run
 */
export type SafeRunOptions = {
  /**
   * Run custom logic as the last operation. If the callback in safeRun didn't
   * throw an error, then it will run after `onAfter`. If the callback throws
   * an error, then it will run after `onFail`.
   */
  onLast?: PromisableCallback;

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
  exitFailCode?: ExitCode;

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
 *     onLast: () => console.log('Cleanup'),
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
    onLast,
    exitOnFailed = false,
    exitFailCode = 1 as ExitCode,
    timeoutMs,
  } = options;

  /**
   * Safely executes a hook, catching and logging any errors without crashing
   */
  async function runHook(
    hook: PromisableCallback | ErrorCallback | undefined,
    error?: Error,
  ): Promise<void> {
    if (!hook) return;

    try {
      if (error && hook.length > 0) {
        // It's an error callback
        await (hook as ErrorCallback)(error);
      } else {
        await (hook as PromisableCallback)();
      }
    } catch (hookError) {
      // Log hook errors but don't let them crash the execution flow
      console.error(`Hook execution failed:`, hookError);
    }
  }

  /**
   * Creates a timeout promise that rejects after specified milliseconds
   */
  function createTimeoutPromise(ms: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new TimeoutError(`Operation timed out after ${ms}ms`, ms));
      }, ms);
    });
  }

  let mainError: Error | null = null;

  try {
    // Run before hook if provided
    await runHook(onBefore);

    // Execute main callback with optional timeout
    if (timeoutMs && timeoutMs > 0) {
      await Promise.race([callback(), createTimeoutPromise(timeoutMs)]);
    } else {
      await callback();
    }

    // Run after hook on success
    await runHook(onAfter);
  } catch (error) {
    mainError = error instanceof Error ? error : new Error(String(error));

    // Run fail hook with error context
    await runHook(onFail, mainError);

    // Exit process if configured to do so
    if (exitOnFailed) {
      process.exit(exitFailCode);
    }

    // Re-throw the error so caller can handle it if process doesn't exit
    throw mainError;
  } finally {
    // Always run last hook if provided
    await runHook(onLast);
  }
}

// Helper type guard for exit codes
export function isValidExitCode(code: number): code is ExitCode {
  return (
    code === 0 ||
    code === 1 ||
    code === 2 ||
    code === 126 ||
    code === 127 ||
    (code >= 128 && code <= 137) ||
    code === 255
  );
}
