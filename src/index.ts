#!/usr/bin/env node
import { downloadTemplate, addModules, initGit, addCi, npmInstall } from "./steps"
import { sayGoodbye, saySetupIsRunning, sayWelcome } from "./messages"
import { getUserPreferences } from "./prompts"
import { wrapInSpinner } from "./utils/spinner"


const main = async () => {
  await sayWelcome()

  const preferences = await getUserPreferences()

  saySetupIsRunning(preferences)

  // 1. Download the Nuxt 3 template
  const template = await wrapInSpinner("Downloading Nuxt 3 template", downloadTemplate, preferences)

  // 2. Add modules
  await addModules(preferences, template.dir)

  // 3. Initialize git
  if (preferences.runGitInit) {
    await initGit(template.dir)
  }

  // 4. Add CI
  if (preferences.addCi) {
    await addCi(template.dir)
  }

  // 5. Run npm | pnpm | yarn install
  if (preferences.runInstall) {
    await npmInstall(template.dir)
  }

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
