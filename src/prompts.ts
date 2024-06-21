import prompts from 'prompts'
import type { PromptObject, PromptType } from 'prompts'
import { say } from './messages'
import { getUserPkgManager } from './utils/getUserPkgManager'
import { getRandomProjectNoun } from './utils/getRandomProjectNoun'
import type { Preferences, Stack } from './types'
import { modules } from './configs'

function skipIf(stacksToSkip: Stack[], promptType: PromptType) {
  return (_: unknown, preferences: Record<string, string>) => {
    return stacksToSkip.includes(preferences.setStack as Stack) ? null : promptType
  }
}

const PROMPT_QUESTIONS: PromptObject[] = [
  {
    type: 'text',
    name: 'setProjectName',
    message: 'What will your project be called?',
    initial: `my-sidebase-${getRandomProjectNoun()}`
  },
  {
    type: 'select',
    name: 'setStack',
    message: 'What stack would you like to use for your new project? More information: https://sidebase.io/sidebase/welcome/stacks',
    choices: [
      { title: 'Merino', description: 'A modular stack that let\'s you choose configuration and modules, e.g.: Want Prisma ORM or not? Want Authentication or not? ... Merino is ideal if you want fine-grained control', value: 'merino' },
      { title: 'Cheviot', description: 'A batteries-included stack where most decisions were made for you. Cheviot is ideal if you want to just get going with an opinionated stack that works', value: 'cheviot' },
    ],
    initial: 0
  },
  {
    type: skipIf(['cheviot'], 'multiselect'),
    name: 'addModules',
    message: 'Which modules would you like to use?',
    choices: Object.entries(modules).map((
      [key, { humanReadableName, description }]) => ({ title: humanReadableName, description, value: key }))
  },
  {
    type: 'confirm',
    name: 'runGitInit',
    message: 'Initialize a new git repository?',
    initial: true,
  },
  {
    type: skipIf(['cheviot'], 'select'),
    name: 'addCi',
    message: 'Initialize a default CI pipeline?',
    choices: [
      { title: 'No CI', description: 'Scaffold a project without any CI pipeline', value: 'none' },
      { title: 'GitHub Actions', description: 'Run your CI with GitHub actions', value: 'github' },
      { title: 'DroneCI', description: 'Run your CI with Drone', value: 'drone' },
    ],
    initial: 0,
  },
  {
    type: 'confirm',
    name: 'runInstall',
    message: () => {
      const packageManager = getUserPkgManager()
      return `Would you like to run \`${packageManager} install\` after finishing up?`
    },
    initial: true,
  }
]

function onCancel() {
  say('Aborting mission - have a pleasent day 👋')
  process.exit()
}

export const getUserPreferences = () => prompts(PROMPT_QUESTIONS, { onCancel }) as Promise<Preferences>
