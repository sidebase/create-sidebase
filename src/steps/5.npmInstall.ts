import { execa } from "execa"

export default (packageManager: string, templateDir: string) => execa(packageManager, ["install"], { cwd: templateDir, env: { NODE_ENV: "development" } })
