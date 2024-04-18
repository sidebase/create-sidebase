import type { Config, Dependency, ModuleConfig, Preferences, Script } from '../types'
import { addPackageDependencies } from '../utils/package/addPackageDependency'
import { addPackageScripts } from '../utils/package/addPackageScript'

export default async function (preferences: Preferences, configs: Config[], modules: ModuleConfig[]) {
  // If no configs or modules were passed, skip.
  if (configs.length === 0 && modules.length === 0) {
    return
  }

  const dependenciesToAdd: Dependency[] = []
  const scriptsToAdd: Script[] = []

  // 1. Collect all dependencies
  configs.forEach(({ dependencies, scripts }) => {
    dependenciesToAdd.push(...dependencies)
    scriptsToAdd.push(...scripts)
  })
  modules.forEach(({ dependencies, scripts }) => {
    dependenciesToAdd.push(...dependencies)
    scriptsToAdd.push(...scripts)
  })

  // 2. Add the dependencies to the `package.json`
  await addPackageDependencies({
    projectDir: preferences.setProjectName,
    dependencies: dependenciesToAdd
  })

  // 3. Add the scripts to the `package.json`
  await addPackageScripts({
    projectDir: preferences.setProjectName,
    scripts: scriptsToAdd
  })
}
