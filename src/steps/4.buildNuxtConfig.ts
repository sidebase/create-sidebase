import { writeFile } from 'node:fs/promises'
import { inspect } from 'node:util'
import type { NuxtConfig } from '@nuxt/schema'
import defu from 'defu'
import type { Config, ModuleConfig } from '../types'
import { getResolver } from '../getResolver'

export default async function (templateDir: string, configs: Config[], modules: ModuleConfig[]) {
  // If no configs or modules were passed, skip.
  if (configs.length === 0 && modules.length === 0) {
    return
  }

  const resolver = getResolver(templateDir)
  const nuxtConfigExtensions: NuxtConfig[] = []

  // 1. Collect Nuxt Config extensions
  configs.forEach(({ nuxtConfig }) => nuxtConfigExtensions.push(nuxtConfig))
  modules.forEach(({ nuxtConfig }) => nuxtConfigExtensions.push(nuxtConfig))

  // 2. Build base Nuxt Config
  let nuxtConfig = {
    typescript: {
      shim: false,
    },
  }
  for (const nuxtConfigExtension of nuxtConfigExtensions) {
    nuxtConfig = defu(nuxtConfig, nuxtConfigExtension)
  }
  const nuxtConfigFile = `// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig(${inspect(nuxtConfig, { compact: false })})
`
  await writeFile(resolver('nuxt.config.ts'), nuxtConfigFile)
}
