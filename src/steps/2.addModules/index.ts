import { getResolver } from "../../getResolver"
import { Preferences  } from "../../prompts"
import { File, moduleConfigs, SupportedDependencies } from "./moduleConfigs"
import { addPackageDependencies, Dependency } from "../../utils/addPackageDependency"
import { writeFile, mkdir } from "node:fs/promises"
import path from "node:path"

export default async (preferences: Preferences, templateDir: string) => {
  const selectedModules: SupportedDependencies[] = preferences.addModules
  if (!selectedModules || selectedModules.length === 0) {
    return
  }

  const resolver = getResolver(templateDir)


  let dependencies: Dependency[] = []
  let modulesForNuxt: string[] = []
  let extendsForNuxt: string[] = []
  let files: File[] = []

  for (const selectedModule of selectedModules) {
    dependencies = [...dependencies, ...moduleConfigs[selectedModule].dependencies]
    modulesForNuxt = modulesForNuxt.concat(moduleConfigs[selectedModule].nuxtModuleNames)
    extendsForNuxt = extendsForNuxt.concat(moduleConfigs[selectedModule].nuxtExtendsNames)
    files = files.concat(moduleConfigs[selectedModule].files)
  }

  // 1. Add required dependencies to `package.json`
  addPackageDependencies({
    projectDir: preferences.setProjectName,
    dependencies
  })

  // 2. Add extra files for modules that need it
  for (const file of files) {
    const folder = path.dirname(file.path)
    await mkdir(resolver(folder), { recursive: true })
    await writeFile(resolver(file.path), file.content)
  }

  // 3. Write nuxt config
  const modulesForNuxtFormatted = `[${modulesForNuxt.map(module => `"${module}"`).join(", ")}]`
  const extendsForNuxtFormatted = `[${extendsForNuxt.map(module => `"${module}"`).join(", ")}]`
  const nuxtConfig = `// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ${modulesForNuxtFormatted},
  extends: ${extendsForNuxtFormatted},
})
`
  await writeFile(resolver("nuxt.config.ts"), nuxtConfig)


}
