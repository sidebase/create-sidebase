import { getResolver } from "../../getResolver"
import { Preferences  } from "../../prompts"
import { File, moduleConfigs, Modules } from "./moduleConfigs"
import { addPackageDependencies, Dependency } from "../../utils/addPackageDependency"
import { writeFile, mkdir } from "node:fs/promises"
import path from "node:path"
import { NuxtConfig } from "@nuxt/schema"
import defu from "defu"
import { inspect } from "node:util"
import { generateIndexVue } from "./generateIndexVue"
import { buttonLink } from "./generateModuleComponents"

export default async (preferences: Preferences, templateDir: string) => {
  const selectedModules: Modules[] = preferences.addModules || []
  const resolver = getResolver(templateDir)

  // 1. Gather module configuration for all selected modules
  let dependencies: Dependency[] = []
  let nuxtConfigExtensions: NuxtConfig[] = []
  let files: File[] = []

  for (const selectedModule of selectedModules) {
    dependencies = [...dependencies, ...moduleConfigs[selectedModule].dependencies]
    nuxtConfigExtensions = nuxtConfigExtensions.concat(moduleConfigs[selectedModule].nuxtConfig)
    files = files.concat(moduleConfigs[selectedModule].files)
  }

  // 2. Add required dependencies to `package.json`
  addPackageDependencies({
    projectDir: preferences.setProjectName,
    dependencies
  })

  // 3. Add extra files for modules that need it
  for (const file of files) {
    const folder = path.dirname(file.path)
    await mkdir(resolver(folder), { recursive: true })
    await writeFile(resolver(file.path), file.content)
  }

  // 4. Write nuxt config
  let nuxtConfig = {
    typescript: {
      shim: false
    }
  }
  for (const nuxtConfigExtension of nuxtConfigExtensions) {
    nuxtConfig = defu(nuxtConfig, nuxtConfigExtension)
  }
  const nuxtConfigFile = `// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig(${inspect(nuxtConfig, { compact: false })})
`
  await writeFile(resolver("nuxt.config.ts"), nuxtConfigFile)

  // 5. Write app.vue to ensure that sub-example-pages of different modules will work
  const nuxtAppVue = `<template>
  <div>
    <NuxtPage />
  </div>
</template>
`
  await writeFile(resolver("app.vue"), nuxtAppVue)

  // 6. Write index.vue with a nice welcome message as well as links to sub-pages
  const nuxtPagesIndexVue = generateIndexVue(selectedModules)
  await mkdir(resolver("pages"), { recursive: true })
  await writeFile(resolver("pages/index.vue"), nuxtPagesIndexVue)

  // 7. Write ButtonLink.vue for the module components
  if (selectedModules.length > 0) {
    await mkdir(resolver("components/Welcome"), { recursive: true })
    await writeFile(resolver("components/Welcome/ButtonLink.vue"), buttonLink)
  }
}
