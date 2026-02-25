import { readFileSync } from "fs";
import type { EventPayloadMap } from "@octokit/webhooks-types";
import {
  getGithubEventName,
  getGithubEventPath,
} from "./github-ci-variables.js";

/**
 * All available GitHub event names.
 */
export type GithubEventName = keyof EventPayloadMap;

/**
 * Type guard to check if the event name matches a specific event type.
 *
 * @example
 * ```typescript
 * if (isEventType(eventName, "pull_request")) {
 *   // TypeScript knows this is PullRequestEvent
 *   const payload = getGithubEventPayload("pull_request");
 * }
 * ```
 */
export function isEventType<T extends GithubEventName>(
  eventName: GithubEventName | undefined,
  expected: T,
): eventName is T {
  return eventName === expected;
}

/**
 * Gets the typed event payload for the current workflow run.
 *
 * This function reads the event payload from `GITHUB_EVENT_PATH` and parses it
 * as the specified event type. Use the generic type parameter to specify which
 * event payload you expect.
 *
 * @example
 * ```typescript
 * // Get PR payload with full type safety
 * const payload = getGithubEventPayload<"pull_request">();
 * if (payload) {
 *   console.log(`PR #${payload.pull_request.number}: ${payload.pull_request.title}`);
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Get push payload
 * const payload = getGithubEventPayload<"push">();
 * if (payload) {
 *   console.log(`Pushed ${payload.commits.length} commits to ${payload.ref}`);
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Type narrowing with isEventType
 * const eventName = getGithubEventName();
 * if (isEventType(eventName, "pull_request")) {
 *   const payload = getGithubEventPayload<"pull_request">();
 *   // payload is fully typed as PullRequestEvent
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Handle multiple event types
 * const eventName = getGithubEventName();
 * switch (eventName) {
 *   case "pull_request":
 *     const prPayload = getGithubEventPayload<"pull_request">();
 *     handlePullRequest(prPayload);
 *     break;
 *   case "push":
 *     const pushPayload = getGithubEventPayload<"push">();
 *     handlePush(pushPayload);
 *     break;
 *   default:
 *     console.log(`Unhandled event: ${eventName}`);
 * }
 * ```
 *
 * @param eventName - Optional event name override (defaults to GITHUB_EVENT_NAME env var)
 * @returns The typed event payload, or undefined if not in GitHub Actions, file not found, or parse error
 */
export function getGithubEventPayload<T extends GithubEventName>(
  eventName?: T,
): EventPayloadMap[T] | undefined {
  const path = getGithubEventPath();

  if (!path) {
    return undefined;
  }

  // If no event name provided, try to get from env
  const actualEventName = eventName ?? getGithubEventName();
  if (!actualEventName) {
    return undefined;
  }

  try {
    const content = readFileSync(path, "utf-8");
    const payload = JSON.parse(content) as EventPayloadMap[T];
    return payload;
  } catch (error) {
    // File not found or invalid JSON
    return undefined;
  }
}

/**
 * Gets the event payload with automatic type detection based on GITHUB_EVENT_NAME.
 *
 * This is less type-safe than the generic version but useful when you don't know
 * the event type at compile time. Use type guards to narrow the type.
 *
 * @example
 * ```typescript
 * const payload = getGithubEventPayloadAuto();
 * if (!payload) return;
 *
 * // Type narrowing required
 * if ("pull_request" in payload) {
 *   // TypeScript knows this has pull_request property
 *   console.log(payload.pull_request.number);
 * }
 * ```
 */
export function getGithubEventPayloadAuto():
  | EventPayloadMap[GithubEventName]
  | undefined {
  const eventName = getGithubEventName();
  if (!eventName) return undefined;

  return getGithubEventPayload(eventName);
}

/**
 * Safe payload getter with validation.
 *
 * Returns an object with the payload or an error, following the Result pattern.
 *
 * @example
 * ```typescript
 * const result = getGithubEventPayloadSafe<"pull_request">();
 * if (result.success) {
 *   console.log(result.data.pull_request.number);
 * } else {
 *   console.error("Failed to load payload:", result.error);
 * }
 * ```
 */
export function getGithubEventPayloadSafe<T extends GithubEventName>(
  eventName?: T,
):
  | { success: true; data: EventPayloadMap[T] }
  | { success: false; error: string } {
  const path = getGithubEventPath();
  const actualEventName = eventName ?? getGithubEventName();

  if (!path) {
    return { success: false, error: "GITHUB_EVENT_PATH not set" };
  }

  if (!actualEventName) {
    return {
      success: false,
      error: "GITHUB_EVENT_NAME not set and no eventName provided",
    };
  }

  try {
    const content = readFileSync(path, "utf-8");
    const payload = JSON.parse(content) as EventPayloadMap[T];
    return { success: true, data: payload };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error reading payload",
    };
  }
}

/**
 * Higher-order function to create a typed payload getter for a specific event.
 *
 * @example
 * ```typescript
 * const getPullRequestPayload = createPayloadGetter("pull_request");
 *
 * // Later in code - no generic needed, already typed
 * const payload = getPullRequestPayload();
 * // payload is PullRequestEvent | undefined
 * ```
 */
export function createPayloadGetter<T extends GithubEventName>(eventName: T) {
  return function (): EventPayloadMap[T] | undefined {
    return getGithubEventPayload(eventName);
  };
}
