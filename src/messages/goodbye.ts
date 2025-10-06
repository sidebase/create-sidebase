import chalk from 'chalk'
import type { Preferences } from '../types'
import { getUserPkgManager } from '../utils/getUserPkgManager'
import { diamond } from '.'

function sayCommand(command: string, comment = '') {
  const coloredCommand = chalk.blue(`> ${command}`)
  if (comment.length > 0) {
    const coloredComment = chalk.gray(`// ${comment}`)

    // pad command to have unified length for all logging output
    const assembledLine = `${coloredCommand.padEnd(40, ' ')} ${coloredComment}`
    console.log(assembledLine)
  }
  else {
    console.log(coloredCommand)
  }
}

export function sayGoodbye(preferences: Preferences) {
  console.log()
  console.log(diamond)
  console.log('✨ Project setup finished. Next steps are:')

  sayCommand(`cd ${preferences.setProjectName}`, 'Enter your project directory')

  const packageManager = getUserPkgManager()
  if (!preferences.runInstall) {
    sayCommand(`${packageManager} install`, 'Install project dependencies')
  }

  if (preferences.addModules?.includes('prisma')) {
    sayCommand(`${packageManager} run db`, 'Start the local postgres database in a new window')
    sayCommand('npx prisma db push', 'Initialize the database & Prisma client')
  }

  sayCommand(`${packageManager} run dev`, 'Start the development server, use CTRL+C to stop')

  console.log(`\nStuck? Join us at ${chalk.blue('https://discord.gg/auc8eCeGzx')}\n`)
  console.log(`🐑 So Long, and Thanks for ... using ${chalk.green('sidebase')} to setup your application`)
}
