#!/usr/bin/env node
import { downloadTemplate, addModules, initGit, addCi, npmInstall, addReadme } from "./steps"
import { sayGoodbye, sayQuickWelcome, saySetupIsRunning, sayWelcome } from "./messages"
import { getUserPreferences } from "./prompts"
import { wrapInSpinner } from "./utils/spinner"
import { getUserPkgManager } from "./utils/getUserPkgManager"
import { cliOptions } from "./utils/parseCliOptions"


const main = async () => {
  const { quick } = cliOptions
  if (!quick) {
    await sayWelcome()
  } else {
    sayQuickWelcome()
  }

  const preferences = await getUserPreferences()

  if (!quick) {
    saySetupIsRunning(preferences)
  }

  // 1. Download the Nuxt 3 template
  const template = await wrapInSpinner("Adding Nuxt 3 template", downloadTemplate, preferences)

  // 2. Add modules
  await wrapInSpinner("Adding Nuxt modules", addModules, preferences, template.dir)

  // 3. Initialize git
  if (preferences.runGitInit) {
    await wrapInSpinner("Running `git init`", initGit, template.dir)
  }

  // 4. Add CI
  if (preferences.addCi === "github") {
    await wrapInSpinner("Adding CI template", addCi, preferences, template.dir)
  }

  // 5. Run install
  if (preferences.runInstall) {
    await wrapInSpinner(`Running \`${getUserPkgManager()} install\``, npmInstall, template.dir)
  }

  // 6. Write readme
  await wrapInSpinner("Adding README", addReadme, preferences, template.dir)

  sayGoodbye(preferences)
}

main().catch((err) => {
  console.error("Aborting installation...")
  if (err instanceof Error) {
    console.error(err)
  } else {
    console.error(
      "An unknown error has occurred. Please open an issue on github with the below:",
    )
    console.log(err)
  }
  process.exit(1)
})
