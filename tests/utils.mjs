import path from 'node:path';

export const FIXTURE_DIR_RELATIVE = './tests/fixtures';

export const OUTPUT_DIR_RELATIVE = './out-dir-test';

// Detect Docker environment by checking for a specific environment variable
export const isDockerEnv = process.env.CI_DOCKER_TEST === 'true';

/**
 * Returns an environment-aware path for CLI arguments.
 * Prepends '/app/data/' if in a Docker test environment, otherwise returns the relative path.
 * @param {string} relativePath The path relative to the project root.
 * @returns {string} The environment-aware path.
 */
export function resolveEnvironmentPath(relativePath) {
  return isDockerEnv ? path.join('/app/data', relativePath) : relativePath;
}
