import chalk from "chalk"
import type { Preferences } from "./prompts"
import { getUserPkgManager } from "./utils/getUserPkgManager"
import { getVersion } from "./utils/getVersion"

const diamond = chalk.bold.gray("🐑 Diamond:").padEnd(12, " ")  // Make `diamond` fixed sized -> emojis can habe surprising lengths

export const say = (message: string) => {
  console.log(diamond)
  console.log(message)
}

// Artist of sheep: Bob Allison, taken from https://ascii.co.uk/art/sheep on 17.12.2022
const makeBanner = (welcome: string) => `
        __  _
    .-.'  \`; \`-._  __  _
   (_,         .-:'  \`; \`-._
 ,'o"(        (_,           )
(__,-'      ,'o"(            )>
   (       (__,-'            )
    \`-'._.--._(             )
       |||  |||\`-'._.--._.-'
                  |||  |||
${diamond}
${welcome}
`

export const sayWelcome = async () => {
  const version = await getVersion()
  const welcome = `Welcome to ${chalk.green(`sidebase v${version}`)}!`
  const banner = makeBanner(welcome)
  console.log(banner)

  say(`sidebase helps you to create fully typesafe Nuxt 3 app in seconds: ${chalk.blue("https://sidebase.io/sidebase")} \n`)

  say("Let's get started:")
}

export const sayQuickWelcome = async () => {
  const welcome = `Welcome to ${chalk.green("sidebase")} (${chalk.blue("https://sidebase.io/sidebase")})! Thanks for choosing the warp route:`
  const banner = makeBanner(welcome)
  console.log(banner)
}

export const saySetupIsRunning = (preferences: Preferences) => {
  console.log()
  say(`Now setting up ${chalk.green(preferences.setProjectName)}:`)
}

const sayCommand = (command: string, comment = "") => {
  if (comment.length > 0) {
    console.log(chalk.blue(`> ${command}`).padEnd(32, " "), chalk.gray(`// ${comment}`))
  } else {
    console.log(chalk.blue(`> ${command}`))
  }
}

export const sayGoodbye = (preferences: Preferences) => {
  console.log()
  console.log(diamond)
  console.log("✨ Project setup finished. Next steps are:")

  sayCommand(`cd ${preferences.setProjectName}`, "Enter your project directory")

  const packageManager = getUserPkgManager()
  if (!preferences.runInstall) {
    sayCommand(`${packageManager} install`, "Install project dependencies")
  }

  if (preferences.addModules?.includes("prisma") || preferences.setStack === "cheviot") {
    sayCommand("npx prisma db push", "Initialize the database")
    sayCommand("npx prisma generate", "Initialize the Prisma client")
  }

  sayCommand(`${packageManager} run dev`, "Start the development server, use CTRL+C to stop")

  console.log(`\nStuck? Join us at ${chalk.blue("https://discord.gg/auc8eCeGzx")}\n`)
  console.log(`🐑 So Long, and Thanks for ... using ${chalk.green("sidebase")} to setup your application`)
}
