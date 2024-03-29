import { downloadTemplate } from "giget"
import { Preferences } from "../prompts"
import { say } from "../messages"
import { packageConfigs } from "../configs"
import { addPackageDependencies, addPackageScripts } from "../utils/addPackageDependency"
import { writeFile, mkdir } from "node:fs/promises"
import path from "node:path"
import { getResolver } from "../utils/getResolver"

const KNOWN_TEMPLATES = {
  "merino": "github:nuxt/starter#v3",
  "cheviot": "community/sidebase"
}

export default async (preferences: Preferences) => {
  const templateName = KNOWN_TEMPLATES[preferences.setStack as keyof typeof KNOWN_TEMPLATES]

  // 1. Download template
  let template
  try {
    template = await downloadTemplate(templateName, {
      dir: preferences.setProjectName,
      registry: "https://raw.githubusercontent.com/nuxt/starter/templates/templates"
    })
  } catch (error) {
    console.log()
    say("Failed to initialize project folder - does a folder with the same name already exist? Aborting mission. Here is the full error:")
    console.error(error)
    process.exit()
  }

  // 2. Add missing dependencies
  const packages = Object.values(packageConfigs).filter(({ type }) => type === "template")
  const dependencies = packages.flatMap(({ dependencies }) => dependencies)
  const scripts = packages.flatMap(({ scripts }) => scripts)
  addPackageDependencies({
    projectDir: preferences.setProjectName,
    dependencies
  })
  addPackageScripts({
    projectDir: preferences.setProjectName,
    scripts,
  })

  // 3. Add extra files
  const resolver = getResolver(template.dir)
  const files = packages.flatMap(({ files }) => files)
  for (const file of files) {
    const folder = path.dirname(file.path)
    await mkdir(resolver(folder), { recursive: true })
    await writeFile(resolver(file.path), file.content)
  }

  return template
}
