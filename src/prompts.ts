import prompts, { PromptType, type PromptObject } from "prompts"
import { say } from "./messages"
import { moduleConfigs } from "./steps/2.addModules/moduleConfigs"
import { getUserPkgManager } from "./utils/getUserPkgManager"
import { getRandomProjectNoun } from "./utils/getRandomProjectNoun"

const skipIfCheviotWasChosen = (typeIfNotMerino: PromptType) => (_: unknown, preferences: Record<string, string>) => preferences.setStack === "cheviot" ? null : typeIfNotMerino

const PROMPT_QUESTIONS: PromptObject[] = [
  {
    type: "text",
    name: "setProjectName",
    message: "What will your project be called?",
    initial: `my-sidebase-${getRandomProjectNoun()}`
  },
  {
    type: "select",
    name: "setStack",
    message: "What stack would you like to use for your new project? More information: https://sidebase.io/sidebase/welcome/stacks",
    choices: [
      { title: "Merino", description: "A modular stack that let's you choose configuration and modules, e.g.: Want Prisma ORM or not? Want Authentication or not? ... Merino is ideal if you want fine-grained control", value: "merino" },
      { title: "Cheviot", description: "A batteries-included stack where most decisions were made for you. Cheviot is ideal if you want to just get going with an opinionated stack that works", value: "cheviot" },
    ],
    initial: 0
  },
  {
    type: skipIfCheviotWasChosen("multiselect"),
    "name": "addModules",
    message: "Which modules would you like to use?",
    choices: Object.entries(moduleConfigs).map(([key, { humanReadableName, description }]) => ({ title: humanReadableName, description, value: key }))
  },
  {
    type: "confirm",
    name: "runGitInit",
    message: "Initialize a new git repository?",
    initial: true,
  },
  {
    type: skipIfCheviotWasChosen("select"),
    name: "addCi",
    message: "Initialize a default CI pipeline?",
    choices: [
      { title: "No CI", description: "Scaffold a project without any CI pipeline", value: "none" },
      { title: "GitHub Actions", description: "Run your CI with GitHub actions.", value: "github" },
    ],
    initial: 0,
  },
  {
    type: "confirm",
    name: "runInstall",
    message: () => {
      const packageManager = getUserPkgManager()
      return `Would you like to run \`${packageManager} install\` after finishing up?`
    },
    initial: true,
  }
]

const onCancel = () => {
  say("Aborting mission - have a pleasent day 👋")
  process.exit()
}

export const getUserPreferences = () => prompts(PROMPT_QUESTIONS, { onCancel })
export type Preferences = Awaited<ReturnType<typeof getUserPreferences>>
