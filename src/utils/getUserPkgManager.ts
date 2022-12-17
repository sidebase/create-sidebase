// Adapted from https://github.com/t3-oss/create-t3-app/blob/63847602f40c61678cab6a2d3bf3330aae925dd2/cli/src/utils/getUserPkgManager.ts#L1-L19
export type PackageManager = "npm" | "pnpm" | "yarn";

let manager: PackageManager
export const getUserPkgManager: () => PackageManager = () => {
  if (manager) {
    return manager
  }
  // This environment variable is set by npm and yarn but pnpm seems less consistent
  const userAgent = process.env.npm_config_user_agent

  if (userAgent) {
    if (userAgent.startsWith("yarn")) {
      manager = "yarn"
    } else if (userAgent.startsWith("pnpm")) {
      manager = "pnpm"
    } else {
      manager = "npm"
    }
  } else {
    // If no user agent is set, assume npm
    manager = "npm"
  }

  return manager
}
