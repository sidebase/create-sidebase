import chalk from "chalk"
import { get } from "node:https"
import type { Preferences } from "./prompts"
import { getUserPkgManager } from "./utils/getUserPkgManager"

const diamond = chalk.bold.gray("🐑 Diamond:").padEnd(12, " ")  // Make `diamond` fixed sized -> emojis can habe surprising lengths
const sleep = (duration: number) => new Promise(r => setTimeout(r, duration))

export const say = (message: string) => {
  console.log(diamond)
  console.log(message)
}



export const sayWelcome = async () => {
  const version = await getVersion()
  const styledVersion = chalk.green(`sidebase v${version}`)
  const welcome = `Welcome to ${styledVersion}!`.padEnd(36, " ")

  // Artist of sheep: Bob Allison, taken from https://ascii.co.uk/art/sheep on 17.12.2022
  const sheep = `
                                             __  _
                                         .-.'  \`; \`-._  __  _
${diamond}                             (_,         .-:'  \`; \`-._
${welcome}    ,'o"(        (_,           )
                                      (__,-'      ,'o"(            )>
                                         (       (__,-'            )
                                          \`-'._.--._(             )
                                             |||  |||\`-'._.--._.-'
                                                        |||  |||
  `
  console.log(sheep)

  await sleep(500)

  say(`sidebase helps you to create fully typesafe Nuxt 3 app in seconds: ${chalk.blue("https://sidebase.io/sidebase")} \n`)

  await sleep(1500)

  say("Let's get started!\n")
}

export const saySetupIsRunning = (preferences: Preferences) => {
  console.log("\n")
  say(`Now setting up ${chalk.green(preferences.setProjectName)}`)
  console.log("\n")
}

const sayCommand = (command: string, comment = "") => {
  if (comment.length > 0) {
    console.log(chalk.blue(`> ${command}`).padEnd(32, " "), chalk.gray(`// ${comment}`))
  } else {
    console.log(chalk.blue(`> ${command}`))
  }
}

export const sayGoodbye = (preferences: Preferences) => {
  console.log("\n")
  console.log(diamond)
  console.log("✨ Project setup finished. Next steps are:")

  sayCommand(`cd ${preferences.setProjectName}`, "Enter your project directory")

  const packageManager = getUserPkgManager()
  if (!preferences.runInstall) {
    sayCommand(`${packageManager} install`, "Install project dependencies")
  }

  if (preferences.addModules.includes("prisma")) {
    sayCommand("npx prisma generate", "Initialize the Prisma client")
  }

  sayCommand(`${packageManager} run dev`, "Start the development server, use CTRL+C to stop")

  console.log(`\nStuck? Join us at ${chalk.blue("https://discord.gg/auc8eCeGzx")}\n`)
  console.log(`🐑 So Long, and Thanks for ... using ${chalk.green("sidebase")} to setup your application`)
}



// Adapted from: https://github.com/withastro/astro/blob/2552816d5fa14a191a73179698b4b6f574a9963f/packages/create-astro/src/messages.ts#L44-L58
let v: string
export const getVersion = () => {

  return new Promise<string>((resolve) => {
    if (v) return resolve(v)
    get("https://registry.npmjs.org/create-sidebase/latest", (res) => {
      let body = ""
      res.on("data", (chunk) => (body += chunk))
      res.on("end", () => {
        const { version } = JSON.parse(body)
        v = version
        resolve(version)
      })
    })
  })
}
