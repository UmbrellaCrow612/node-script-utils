#!/usr/bin/env node

/**
 * Build and publish script
 * 1. Deletes previous dist directory
 * 2. Runs TypeScript compiler
 * 3. Copies package.json to dist
 * 4. Changes to dist directory
 * 5. Logs into npm
 * 6. Publishes package
 */

import { spawn } from "node:child_process";
import { copyFile, access, rm, mkdir } from "node:fs/promises";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// Colors for terminal output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const isWindows = process.platform === "win32";
    const shell = isWindows ? true : false;

    const child = spawn(command, args, {
      stdio: "inherit",
      shell,
      ...options,
    });

    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Command failed with exit code ${code}`));
      } else {
        resolve();
      }
    });

    child.on("error", (err) => {
      reject(err);
    });
  });
}

async function directoryExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const rootDir = resolve(__dirname, "..");
  const distDir = join(rootDir, "dist");

  try {
    // Step 1: Delete previous dist directory
    log("\n🗑️  Checking for previous dist directory...", "bright");
    if (await directoryExists(distDir)) {
      log("   Found existing dist, deleting...", "yellow");
      await rm(distDir, { recursive: true, force: true });
      log("✅ Previous dist directory removed", "green");
    } else {
      log("   No previous dist directory found", "blue");
    }

    // Step 2: Run TypeScript compiler
    log("\n📦 Running TypeScript compiler...", "bright");
    await runCommand("npx", ["tsc"], { cwd: rootDir });

    // Verify dist directory was created
    if (!(await directoryExists(distDir))) {
      throw new Error("dist directory not found after compilation");
    }
    log("✅ TypeScript compilation complete", "green");

    // Step 3: Copy package.json to dist
    log("\n📋 Copying package.json to dist...", "bright");
    const pkgSrc = join(rootDir, "package.json");
    const pkgDest = join(distDir, "package.json");
    await copyFile(pkgSrc, pkgDest);
    log("✅ package.json copied", "green");

    // Step 4 & 5: npm login (in dist directory)
    log("\n🔐 Running npm login...", "bright");
    log("   You will be prompted for npm credentials", "yellow");
    await runCommand("npm", ["login"], { cwd: distDir });
    log("✅ npm login complete", "green");

    // Step 6: npm publish (in dist directory)
    log("\n🚀 Publishing to npm...", "bright");
    await runCommand("npm", ["publish"], { cwd: distDir });
    log("✅ Package published successfully!", "green");
  } catch (error) {
    log(`\n❌ Error: ${error.message}`, "red");
    process.exit(1);
  }
}

main();
