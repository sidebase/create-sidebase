import { getUserPkgManager } from "../utils/getUserPkgManager"
import { execa } from "execa"

const install = (templateDir: string) => execa(getUserPkgManager(), ["install"], { cwd: templateDir, env: { NODE_ENV: "development" } })
const lintAndFix = (templateDir: string) => execa(getUserPkgManager(), ["run", "lint", "--", "--fix"], { cwd: templateDir, env: { NODE_ENV: "development" } })

export default (templateDir: string) => install(templateDir).then(() => lintAndFix(templateDir))
