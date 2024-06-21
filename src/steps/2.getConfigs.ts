import type { Config, Preferences } from '../types'
import { configs, modules } from '../configs'
import { getUserPkgManager } from '../utils/getUserPkgManager'

export default function (preferences: Preferences) {
  const setConfigs: Config[] = []

  // 1. Check if stack is not cheviot
  if (preferences.setStack === 'cheviot') {
    return { configs: [], modules: [] }
  }

  // 2. Add Prebuilt CI pipeline
  if (preferences.addCi === 'github') {
    setConfigs.push(configs['github-actions'])
  }
  if (preferences.addCi === 'drone') {
    setConfigs.push(configs.droneCI)
  }

  // 3. Add required base configs
  setConfigs.push(configs.eslint)
  setConfigs.push(configs.typescript)
  setConfigs.push(configs.vscode)

  // 4. If pnpm is used, add `.npmrc`
  if (getUserPkgManager() === 'pnpm') {
    setConfigs.push(configs.pnpm)
  }

  // 5. Get Modules
  const setModules = preferences.addModules?.map(key => modules[key]) ?? []

  return { configs: setConfigs, modules: setModules }
}
