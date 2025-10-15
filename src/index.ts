#!/usr/bin/env node
import type { Preferences } from './types'
import { errorMessage, sayGoodbye, sayQuickWelcome, saySetupIsRunning, sayWelcome, wrapInSpinner } from './messages'
import { getUserPreferences } from './prompts'
import { addReadMe, buildNuxtConfig, buildPackage, downloadTemplate, getConfigs, initGit, install, writeFiles } from './steps'
import { getUserPkgManager } from './utils/getUserPkgManager'
import { logTelemetry } from './utils/logTelemetry'
import { cliOptions } from './utils/parseCliOptions'

async function main() {
  const { quick, ci } = cliOptions

  // Welcome the User
  if (quick) {
    await sayQuickWelcome()
  }
  else {
    await sayWelcome()
  }

  // Collect User preferences
  let preferences: Preferences = {
    setProjectName: 'my-sidebase-app',
    addModules: ['prisma', 'sidebase-auth', 'trpc', 'tailwind', 'naiveui', 'i18n'],
    runGitInit: true,
    addCi: 'github',
    runInstall: true
  }
  if (!ci) {
    preferences = await getUserPreferences()
    logTelemetry(preferences)
  }

  if (!quick) {
    saySetupIsRunning(preferences)
  }

  // 1. Download the Nuxt 3 template
  const template = await wrapInSpinner(`Adding Nuxt`, downloadTemplate, preferences)

  // 2. Get Configs and modules
  const { configs, modules } = getConfigs(preferences)

  // 3. Build `package.json`
  await wrapInSpinner('Building `package.json`', buildPackage, preferences, configs, modules)

  // 4. Build `nuxt.config.ts`
  await wrapInSpinner('Building `nuxt.config.ts`', buildNuxtConfig, template.dir, configs, modules)

  // 5. Write files
  await wrapInSpinner('Writing files', writeFiles, template.dir, configs, modules)

  // 6. Initialize git
  if (preferences.runGitInit) {
    await wrapInSpinner('Running `git init`', initGit, template.dir)
  }

  // 7. Run install
  if (preferences.runInstall) {
    await wrapInSpinner(`Running \`${getUserPkgManager()} install\``, install, template.dir)
  }

  // 8. Write readme
  await wrapInSpinner('Adding README', addReadMe, preferences, template.dir)

  sayGoodbye(preferences)
}

main().catch((err) => {
  errorMessage(err)
  process.exit(1)
})
