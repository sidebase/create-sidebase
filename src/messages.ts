import chalk from "chalk"
import { get } from "node:https"

// length: 8 characters, so sheep needs to be indented negative 8!
const diamond = chalk.bold.gray("Diamond:")

export const say = (message: string) => {
  console.log(diamond)
  console.log(message)
}

export const sayWelcome = async () => {
  const version = await getVersion()
  const styledVersion = chalk.green(`v${version}`)
  const welcome = `Welcome to ${chalk.bgGreen("sidebase")} ${styledVersion}!`.padEnd(36, " ")


  // Artist of sheep: Bob Allison, taken from https://ascii.co.uk/art/sheep on 17.12.2022
  const sheep = `
                                              __  _
                                          .-.'  \`; \`-._  __  _
${diamond}                                 (_,         .-:'  \`; \`-._
${welcome}    ,'o"(        (_,           )
                                      (__,-'      ,'o"(            )>
                                         (       (__,-'            )
                                          \`-'._.--._(             )
                                             |||  |||\`-'._.--._.-'
                                                        |||  |||
  `
  console.log(sheep)
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
