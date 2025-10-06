import { writeFile } from 'node:fs/promises'
import { getResolver } from '../getResolver'
import type { Preferences } from '../types'
import { getUserPkgManager } from '../utils/getUserPkgManager'
import { modules } from '../configs'

function makeReadme(preferences: Preferences) {
  const { setProjectName = 'sidebase', addModules = [], addCi = 'none' } = preferences

  let selectedFeatures = []
  selectedFeatures = addModules.map((module: keyof typeof modules) => `- ${modules[module].humanReadableName}`)
  if (addCi === 'github') {
    selectedFeatures.push('- GitHub Actions based CI')
  }
  selectedFeatures.push('- Linting via ESLint and @antfu/eslint-config')

  const tasksPostInstall = addModules.map(module => modules[module].tasksPostInstall).flat()
  const packageManager = getUserPkgManager()

  return `# ${setProjectName}-app

This is a [sidebase ${setStack}](https://sidebase.io/) app created by running \`${packageManager} create sidebase@latest\`. This project uses the following technologies for a great developer- and user-experience:
- [TypeScript](https://www.typescriptlang.org/)
- [Nuxt 3](https://nuxt.com)
${selectedFeatures.join('\n')}

## How to get going?

This is a straight-forward setup with minimal templating and scaffolding. The options you selected during the sidebase CLI setup are all here though. Good places to continue reading are:
- [the First Steps documentation](https://sidebase.io/sidebase/usage)
- [our discord](https://discord.gg/auc8eCeGzx)

Some tasks you should probably do in the beginning are:
- [ ] replace this generic README with a more specific one
- [ ] install the Vue Volar extension
- [ ] enable [Volar takeover mode](https://nuxt.com/docs/getting-started/installation#prerequisites) to ensure a smooth editor setup
- [ ] [install Nuxt 3 devtools](https://github.com/nuxt/devtools#installation) if you want to use them
${tasksPostInstall.join('\n')}

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
  await writeFile(resolver('README.md'), makeReadme(preferences), { flag: 'w' })
}
