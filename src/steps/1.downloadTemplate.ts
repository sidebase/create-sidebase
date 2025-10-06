import { downloadTemplate } from 'giget'
import { say } from '../messages'
import type { Preferences } from '../types'

const TEMPLATE_NAME = 'github:sidebase/templates#nuxt-3.15.4'

export default async (preferences: Preferences) => {
  // 1. Download template
  let template
  try {
    template = await downloadTemplate(TEMPLATE_NAME, {
      dir: preferences.setProjectName,
      registry: 'https://raw.githubusercontent.com/nuxt/starter/templates/templates'
    })
  }
  catch (error) {
    console.log()
    say('Failed to initialize project folder - does a folder with the same name already exist? Aborting mission. Here is the full error:')
    console.error(error)
    process.exit()
  }

  return template
}
