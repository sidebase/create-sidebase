import { execa } from "execa"

export default (templateDir: string) => execa("git", ["init"], { cwd: templateDir })
