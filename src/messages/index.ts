import chalk from 'chalk'
import { consola } from 'consola'
import type { Preferences } from '../../srcOLD/prompts'

export { sayWelcome, sayQuickWelcome } from './welcome'
export { sayGoodbye } from './goodbye'
export { wrapInSpinner } from './spinner'

// Diamond config
export const diamond = chalk.bold.gray('🐑 Diamond:').padEnd(12, ' ') // Make `diamond` fixed sized -> emojis can habe surprising lengths
export function say(message: string) {
  console.log(diamond)
  consola.info(message)
}

export function saySetupIsRunning(preferences: Preferences) {
  console.log()
  say(`Now setting up ${chalk.green(preferences.setProjectName)}:`)
}

export function errorMessage(error: any, message?: string) {
  consola.error(message || 'Aborting installation... An error has occurred. Please open an issue on github with the below:')
  consola.box(error)
}
