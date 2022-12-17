import { downloadTemplate } from "giget"
import { getResolver } from "../getResolver"
import { Preferences } from "../prompts"
import { getUserPkgManager } from "../utils/getUserPkgManager"
import { writeFile } from "node:fs/promises"

export default async (preferences: Preferences) => {
  // 1. Download template
  const template = await downloadTemplate("v3", {
    dir: preferences.setProjectName,
    registry: "https://raw.githubusercontent.com/nuxt/starter/templates/templates"
  })
  const resolver = getResolver(template.dir)

  // Write .nuxtrc with `shamefully-hoist=true` for pnpm
  const usingPnpm = getUserPkgManager() == "pnpm"
  if (usingPnpm) {
    await writeFile(resolver(".npmrc"), "shamefully-hoist=true")
  }

  return template
}
