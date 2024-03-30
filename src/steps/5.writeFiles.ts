import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { Config, File, ModuleConfig } from '../types'
import { getResolver } from '../getResolver'
import { generateIndexVue } from '../generators/generateIndexVue'
import { buttonLink } from '../generators/generateModuleComponents'

export default async function (templateDir: string, configs: Config[], modules: ModuleConfig[]) {
  // If no configs or modules were passed, skip.
  if (configs.length === 0 && modules.length === 0) {
    return
  }

  const resolver = getResolver(templateDir)
  const filesToAdd: File[] = []

  // 1. Collect all Files
  configs.forEach(({ files }) => filesToAdd.push(...files))
  modules.forEach(({ files }) => filesToAdd.push(...files))

  // 2. Write files
  for (const file of filesToAdd) {
    const folder = path.dirname(file.path)
    await mkdir(resolver(folder), { recursive: true })
    await writeFile(resolver(file.path), file.content)
  }

  // 3. Write app.vue to ensure that sub-example-pages of different modules will work
  const nuxtAppVue = `<template>
    <div>
      <NuxtPage />
    </div>
  </template>
  `
  await writeFile(resolver('app.vue'), nuxtAppVue)

  // 4. Write index.vue with a nice welcome message as well as links to sub-pages
  const nuxtPagesIndexVue = generateIndexVue(modules)
  await mkdir(resolver('pages'), { recursive: true })
  await writeFile(resolver('pages/index.vue'), nuxtPagesIndexVue)

  // 5. Write ButtonLink.vue for the module components
  if (modules.length > 0) {
    await mkdir(resolver('components/Welcome'), { recursive: true })
    await writeFile(resolver('components/Welcome/ButtonLink.vue'), buttonLink)
  }
}
