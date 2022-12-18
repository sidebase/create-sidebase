import prompts, { PromptType, type PromptObject } from "prompts"
import { say } from "./messages"
import { Dependency } from "./utils/addPackageDependency"
import { getUserPkgManager } from "./utils/getUserPkgManager"

export type SupportedDependencies = "tailwind" | "naiveui" | "prisma"

declare interface ModuleConfig {
  humanReadableName: string
  dependencies: Dependency[]
  nuxtModuleNames: string[]
  nuxtExtendsNames: string[]
}
export const moduleConfigs: Record<SupportedDependencies, ModuleConfig> = {
  "tailwind": {
    humanReadableName: "Tailwind CSS",
    dependencies: [{
      name: "@nuxtjs/tailwindcss",
      version: "^6.1.3",
      isDev: true
    }],
    nuxtModuleNames: ["@nuxtjs/tailwindcss"],
    nuxtExtendsNames: []
  },
  "naiveui": {
    humanReadableName: "Naive UI",
    dependencies: [{
      name: "@huntersofbook/naive-ui-nuxt",
      version: "^0.5.1",
      isDev: true
    }],
    nuxtModuleNames: ["@huntersofbook/naive-ui-nuxt"],
    nuxtExtendsNames: []
  },
  "prisma": {
    humanReadableName: "Prisma ORM",
    dependencies: [
      {
        name: "prisma",
        version: "^4.7.1",
        isDev: true
      },
      {
        name: "@prisma/client",
        version: "^4.7.1",
        isDev: false
      },
      {
        name: "@sidebase/nuxt-prisma",
        version: "^0.1.0",
        isDev: false
      }
    ],
    nuxtModuleNames: [],
    nuxtExtendsNames: ["@sidebase/nuxt-prisma"]
  }
}

const skipIfCheviotWasChosen = (typeIfNotMerino: PromptType) => (_: unknown, preferences: Record<string, string>) => preferences.setStack === "cheviot" ? null : typeIfNotMerino

const PROMPT_QUESTIONS: PromptObject[] = [
  {
    type: "text",
    name: "setProjectName",
    message: "What will your project be called?",
    initial: "my-sidebase-app"
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
    choices: [
      { title: "Tailwind CSS", description: "A utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup. See more: https://tailwindcss.com/", value: "tailwind" },
      { title: "Naive UI", description: "A Vue 3 Component Library.Fairly Complete, Theme Customizable, Uses TypeScript, Fast. Kinda Interesting. See more: https://www.naiveui.com/", value: "naiveui" },
      { title: "PrismaORM", description: "Next-generation Node.js and TypeScript ORM. See more: https://www.prisma.io/", value: "prisma"},
    ] as { title: string; description: string; value: SupportedDependencies }[],
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
  },
]

const onCancel = () => {
  say("Aborting mission - have a pleasent day 👋")
  process.exit()
}

export const getUserPreferences = () => prompts(PROMPT_QUESTIONS, { onCancel })
export type Preferences = Awaited<ReturnType<typeof getUserPreferences>>
