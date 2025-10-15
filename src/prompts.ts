import type { PromptObject } from 'prompts'
import type { Preferences } from './types'
import prompts from 'prompts'
import { modules } from './configs'
import { say } from './messages'
import { getRandomProjectNoun } from './utils/getRandomProjectNoun'
import { getUserPkgManager } from './utils/getUserPkgManager'

const PROMPT_QUESTIONS: PromptObject[] = [
  {
    type: 'text',
    name: 'setProjectName',
    message: 'What will your project be called?',
    initial: `my-sidebase-${getRandomProjectNoun()}`
  },
  {
    type: 'multiselect',
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
    type: 'select',
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
