import { execa } from "execa"
import type { PackageManager } from "../utils/getUserPkgManager"

export default (packageManager: PackageManager, templateDir: string) => execa(packageManager, ["install"], { cwd: templateDir, env: { NODE_ENV: "development" } })
