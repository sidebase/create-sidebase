import { downloadTemplate } from "giget"
import { Preferences } from "../prompts"
import { say } from "../messages"

const KNOWN_TEMPLATES = {
  "merino": "github:nuxt/starter#v3",
  "cheviot": "community/sidebase"
}

export default async (preferences: Preferences) => {
  const templateName = KNOWN_TEMPLATES[preferences.setStack as keyof typeof KNOWN_TEMPLATES]

  // 1. Download template
  let template
  try {
    template = await downloadTemplate(templateName, {
      dir: preferences.setProjectName,
      registry: "https://raw.githubusercontent.com/nuxt/starter/templates/templates"
    })
  } catch (error) {
    console.log()
    say("Failed to initialize project folder - does a folder with the same name already exist? Aborting mission. Here is the full error:")
    console.error(error)
    process.exit()
  }

  return template
}
