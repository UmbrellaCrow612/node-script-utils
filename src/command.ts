import { spawn, type SpawnOptionsWithoutStdio } from "node:child_process";

/**
 * Run a given command and wait for it to finish.
 * @param command - The command to run.
 * @param args - Additional arguments to pass to the command.
 * @param options - Spawn options.
 * @param timeout - How long (in seconds) to wait before rejecting.
 * @returns A promise that resolves when the command exits successfully.
 */
export function runCommand(
  command: string,
  args: string[],
  options: SpawnOptionsWithoutStdio,
  timeout: number,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const spwn = spawn(command, args, {
      stdio: "inherit",
      shell: true,
      ...options,
    });

    const tid = setTimeout(() => {
      spwn.kill();
      reject(new Error("Command timed out and took too long to exit"));
    }, timeout * 1000);

    spwn.on("error", (err: Error) => {
      clearTimeout(tid);
      spwn.kill();
      reject(err);
    });

    spwn.on("exit", (exitCode: number | null) => {
      clearTimeout(tid);
      if (exitCode === 0) {
        resolve();
      } else {
        reject(new Error("Command exited with a non-zero exit code"));
      }
    });
  });
}
