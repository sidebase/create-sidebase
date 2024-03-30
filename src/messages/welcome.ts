import chalk from 'chalk'
import { consola } from 'consola'
import { getVersion } from '../utils/getVersion'
import { diamond, say } from '.'

// Artist of sheep: Bob Allison, taken from https://ascii.co.uk/art/sheep on 17.12.2022
function makeBanner(welcome: string) {
  return `
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
}
export async function sayWelcome() {
  const version = await getVersion()
  const welcome = `Welcome to ${chalk.green(`create-sidebase v${version}`)}!`
  const banner = makeBanner(welcome)

  console.log(banner)

  say(`sidebase helps you to create fully typesafe Nuxt 3 app in seconds: ${chalk.blueBright('https://sidebase.io/sidebase')} \n`)

  say('Let\'s get started:')
}

export async function sayQuickWelcome() {
  const version = await getVersion()
  consola.info(`Welcome to ${chalk.green(`create-sidebase v${version}`)} (${chalk.blueBright('https://sidebase.io/sidebase')})! Thanks for choosing the warp route:`)
}
