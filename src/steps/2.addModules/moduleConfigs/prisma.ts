import { generateModuleHTMLComponent, generateModuleHTMLSnippet } from "../generateModuleComponents"
import type { ModuleConfig } from "../moduleConfigs"

const prismaFile = `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  // NOTE: You probably want to change this to another database later on
  provider = "sqlite"

  // This value is read from the .env file.
  url      = env("DATABASE_URL")
}

model Example {
  id          String @id @default(uuid())
  details     String
}
`

const prismaEnvFile = `# Prisma
DATABASE_URL=file:./db.sqlite
`

const prismaExampleEndpoint = `/**
 * Fetch all \`examples\` from the database. Run \`npx prisma db push\` at least once for this to work.
 *
 * If you are using \`tRPC\` you can access the prisma-client by adding it to the context:
 * \`\`\`ts
 * export async function createContext(event: H3Event) {
 *   return { prisma: event.context.prisma }
 * }
 *
 * export type Context = inferAsyncReturnType<typeof createContext>
 * \`\`\`
 */
export default defineEventHandler(event => event.context.prisma.example.findMany())
`

const prismaServerMiddleware = `import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

declare module 'h3' {
  interface H3EventContext {
    prisma: PrismaClient
  }
}

export default eventHandler((event) => {
  if (!prisma) {
    prisma = new PrismaClient()
  }
  event.context.prisma = prisma
})
`

const prismaUtils = `import { execSync } from 'child_process'

/**
 * Helper to reset the database via a programmatic prisma invocation. Helpful to add to \`beforeEach\` or \`beforeAll\` of your testing setup.
 *
 * WARNING: Never run this in production.
 *
 * Taken from https://github.com/prisma/prisma/issues/13549#issuecomment-1144883246
 *
 * @param databaseUrl Connection URL to database. Inferred from \`process.env.DATABASE_URL\` if not provided
 */
export const resetDatabase = (databaseUrl?: string) => {
  const url = databaseUrl || process.env.DATABASE_URL
  if (!url) {
    throw new Error('Cannot reset database - connection string could not be inferred.')
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('This utility should not be called in production. It is meant for testing and development')
  }

  execSync(\`cd \${process.cwd()} && DATABASE_URL=\${url} npx prisma db push --force-reset\`, { stdio: 'inherit' })
}
`

const prismaDemoComponent = `<script lang="ts" setup>
const { data: examples } = useFetch('/api/examples')
</script>
<template>
  ${generateModuleHTMLComponent(
    "Prisma ORM",
    "Prisma unlocks a new level of developer experience when working with databases thanks to its intuitive data model, automated migrations, type-safety & auto-completion.",
    "https://sidebase.io/sidebase/components/prisma",
    `<p>
        Prisma ORM Data from the database, received {{ examples?.length || 0 }} records!
      </p>`,
    "",
  ).html}
</template>
`

const prisma: ModuleConfig = {
  humanReadableName: "Prisma ORM",
  description: "Next-generation Node.js and TypeScript ORM. See more: https://www.prisma.io/",
  dependencies: [
    {
      name: "prisma",
      version: "^5.7.1",
      isDev: true
    },
    {
      name: "@prisma/client",
      version: "^5.7.1",
      isDev: false
    }
  ],
  nuxtConfig: {},
  files: [{
    path: ".env",
    content: prismaEnvFile
  }, {
    path: "prisma/schema.prisma",
    content: prismaFile
  }, {
    path: "server/api/examples.get.ts",
    content: prismaExampleEndpoint
  }, {
    path: "server/middleware/0.prisma.ts",
    content: prismaServerMiddleware
  }, {
    path: "prisma/utils.ts",
    content: prismaUtils
  }, {
    path: "components/Welcome/PrismaDemo.vue",
    content: prismaDemoComponent,
  }],
  tasksPostInstall: [
    "- [ ] Prisma: Edit your `prisma/prisma.schema` to your liking",
    "- [ ] Prisma: Run `npx prisma db push` to sync the schema to your database & generate the Prisma Client",
  ],
  indexVue: generateModuleHTMLSnippet("WelcomePrismaDemo"),
}

export default prisma
