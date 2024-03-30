import type { Config, Preferences } from '../types'
import { configs, modules } from '../configs'

export default function (preferences: Preferences) {
  const setConfigs: Config[] = []

  // 1. Check if stack is not cheviot
  if (preferences.setStack === 'cheviot') {
    return { configs: [], modules: [] }
  }

  // 2. Add Github Actions CI, if enabled
  if (preferences.addCi === 'github') {
    setConfigs.push(configs['github-actions'])
  }

  // 3. Add required base configs
  setConfigs.push(configs.eslint)
  setConfigs.push(configs.typescript)

  // 4. Get Modules
  const setModules = preferences.addModules?.map(key => modules[key]) ?? []

  return { configs: setConfigs, modules: setModules }
}
