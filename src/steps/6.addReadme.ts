import { writeFile } from "node:fs/promises"
import { getResolver } from "../getResolver"
import { moduleConfigs, Preferences } from "../prompts"
import { getUserPkgManager } from "../utils/getUserPkgManager"

const makeReadme = (preferences: Preferences) =>  {
  const { setProjectName = "sidebase", setStack = undefined, addModules = [], addCi = "none" } = preferences

  let selectedFeatures = []
  if (setStack === "merino") {
    selectedFeatures = addModules.map((module: keyof typeof moduleConfigs) => `- ${moduleConfigs[module].humanReadableName}`)
    if (addCi === "github") {
      selectedFeatures.push("- GitHub Actions based CI")
    }
  } else {
    selectedFeatures = [
      "- Database models, migrations, queries and easy DB-switching via Prisma",
      "- Deep Prisma integration: Use the client in your endpoints via nuxt-prisma, Prisma client is auto-generated for npm run dev and other commands and more",
      "- Frontend- and Backend data-transformation via nuxt-parse and zod",
      "- In-memory development SQL-database via sqlite3",
      "- Linting via eslint",
      "- Test management, Test UI, component snapshotting via vitest",
      "- Component tests via test-library/vue",
      "- Nuxt 3 native API testing via @nuxt/test-utils",
      "- Code coverage via c8",
      "- CSS utilities via TailwindCSS",
      "- CSS components via Naive UI",
      "- Type checking in script and template via Volar / vue-tsc",
      "- Code editor configuration via .editorconfig files and a portable .settings/ folder whith best-practice VS Code settings and extensions for Vue 3 / Nuxt 3 development",
    ]
  }


  const packageManager = getUserPkgManager()

  return `# ${setProjectName}-app

This is a [sidebase ${setStack}](https://sidebase.io/) app created by running \`${packageManager} create sidebase@latest\`. This project uses the following technologies for a great developer- and user-experience:
- [TypeScript](https://www.typescriptlang.org/)
- [Nuxt 3](https://nuxt.com)
${selectedFeatures.join("\n")}

## How to get going?

This is a straight-forward setup with minimal templating and scaffolding. The options you selected during the sidebase CLI setup are all here though. Good places to continue are:
- [the First Steps documentation](https://sidebase.io/sidebase/usage)
- [our discord](https://discord.gg/auc8eCeGzx)

In any case, you should probably replace this generic README with a more specific one: Start by describing what the purpose of this project is and maybe add a screenshot of your app to the README?

### Setup

Make sure to install the dependencies:

\`\`\`bash
${packageManager} install
\`\`\`

### Development Server

Start the development server on http://localhost:3000

\`\`\`bash
${packageManager} run dev
\`\`\`

### Production

Build the application for production:

\`\`\`bash
${packageManager} run build
\`\`\`

Locally preview production build:

\`\`\`bash
${packageManager} run preview
\`\`\`
`
}

export default async (preferences: Preferences, templateDir: string) => {
  const resolver = getResolver(templateDir)
  await writeFile(resolver("README.md"), makeReadme(preferences), { flag:"w" })
}
