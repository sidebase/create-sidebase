import { getUserPkgManager } from "../utils/getUserPkgManager"
import { execa } from "execa"

export default (templateDir: string) => execa(getUserPkgManager(), ["install"], { cwd: templateDir, env: { NODE_ENV: "development" } })
