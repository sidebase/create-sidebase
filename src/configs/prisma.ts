import { generateModuleHTMLComponent, generateModuleHTMLSnippet } from '../generators/generateModuleComponents'
import type { ModuleConfig } from '../types'
import { getUserPkgManager } from '../utils/getUserPkgManager'

const prismaRootSchema = `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client"
  output   = "./client"

  engineType = "library"
}

datasource db {
  provider = "postgres"

  url = env("DATABASE_URL")

  // This environment variable can be the same as \`DATABASE_URL\` for non-pglite environments
  directUrl = env("DIRECT_DATABASE_URL")

  // This is required for development only.
  shadowDatabaseUrl = "postgres://postgres@localhost/prisma-shadow?pgbouncer=true&connection_limit=1"
}
`

const prismaExampleSchema = `model Example {
  id          String @id @default(uuid())
  details     String
}
`

const prismaEnvFile = `# Prisma
DATABASE_URL="postgres://postgres@localhost:5432/postgres?pgbouncer=true&connection_limit=1"
DIRECT_DATABASE_URL="postgres://postgres@localhost:5432/postgres?connection_limit=1"
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

const prismaServerMiddleware = `import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

declare module 'h3' {
  interface H3EventContext {
    prisma: PrismaClient
  }
}

export default eventHandler((event) => {
  if (!prisma) {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
    prisma = new PrismaClient({ adapter })
  }
  event.context.prisma = prisma
})
`

const pglite = `/**
 * Script that starts a postgres database using pg-gateway (https://github.com/supabase-community/pg-gateway) and pglite (https://github.com/electric-sql/pglite).
 *
 * We use this database for local development with prisma ORM. The script also supports creating a \`shadow-database\`, which is a second, separate database
 * that prisma uses for certain commands, such as \`pnpm prisma migrate dev\`: https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/shadow-database.
 *
 * To make use of the shadow-database add \`/prisma-shadow\` to the DSN you provide. This script will then spin up a second, in-memory-only database and connect you to it.
 */
import { unlinkSync, writeFileSync } from 'node:fs'
import net from 'node:net'
import { PGlite } from '@electric-sql/pglite'
import { join } from 'pathe'
import { fromNodeSocket } from 'pg-gateway/node'

// If env var is set, we write a file to disk once the server is done starting up. This file can then be used by other processes to check whether the database is ready
const doWriteHealthFile = process.env.WRITE_HEALTH_FILE === 'true'
const HEALTH_FILE_NAME = 'pgliteHealthz'

const db = new PGlite({ dataDir: join(import.meta.dirname, 'pglite-data') })
let activeDb = db

const server = net.createServer(async (socket) => {
  activeDb = db

  console.info(\`Client connected: \${socket.remoteAddress}:\${socket.remotePort}\`)
  await fromNodeSocket(socket, {
    serverVersion: '16.3',

    auth: {
      // No password required
      method: 'trust',
    },

    async onStartup({ clientParams }) {
      // create a temp in-memory instance if connecting to the prisma shadow DB
      if (clientParams?.database === 'prisma-shadow') {
        console.info('Connecting client to shadow database')
        activeDb = new PGlite()
      }

      // Wait for PGlite to be ready before further processing
      await activeDb.waitReady
    },

    // Hook into each client message
    async onMessage(data, { isAuthenticated }) {
      // Only forward messages to PGlite after authentication
      if (!isAuthenticated) {
        return
      }

      // Forward raw message to PGlite and send response to client
      return await activeDb.execProtocolRaw(data)
    },
  })

  socket.on('end', () => {
    console.info('Client disconnected')
  })
})

server.listen(5432, () => {
  if (doWriteHealthFile) {
    writeFileSync(HEALTH_FILE_NAME, '')
  }

  console.info('Server listening on port 5432')
})

server.on('close', () => {
  if (doWriteHealthFile) {
    unlinkSync(HEALTH_FILE_NAME)
  }
})
`

const prismaDemoComponent = `<script lang="ts" setup>
const { data: examples } = useFetch('/api/examples')
</script>

<template>
  ${generateModuleHTMLComponent(
    'Prisma ORM',
    'Prisma unlocks a new level of developer experience when working with databases thanks to its intuitive data model, automated migrations, type-safety & auto-completion.',
    'https://sidebase.io/sidebase/components/prisma',
    `<p>
        Prisma ORM Data from the database, received {{ examples?.length || 0 }} records!
      </p>`,
    '',
  ).html}
</template>
`

const prisma: ModuleConfig = {
  humanReadableName: 'Prisma ORM',
  description: 'Next-generation Node.js and TypeScript ORM. See more: https://www.prisma.io/',
  scripts: [
    {
      name: 'db',
      command: 'node prisma/pglite.ts',
    }
  ],
  dependencies: [
    {
      name: 'prisma',
      version: '^6.16.3',
      isDev: true
    },
    {
      name: '@prisma/client',
      version: '^6.16.3',
      isDev: false
    },
    {
      name: '@prisma/adapter-pg',
      version: '^6.16.3',
      isDev: false,
    },
    {
      name: '@electric-sql/pglite',
      version: '0.2.13',
      isDev: true,
    },
    {
      name: 'pg-gateway',
      version: '0.3.0-beta.4',
      isDev: true,
    }
  ],
  nuxtConfig: {},
  files: [
    {
      path: '.env',
      content: prismaEnvFile
    },
    {
      path: 'prisma/schema/schema.prisma',
      content: prismaRootSchema
    },
    {
      path: 'prisma/schema/example.prisma',
      content: prismaExampleSchema
    },
    {
      path: 'server/api/examples.get.ts',
      content: prismaExampleEndpoint
    },
    {
      path: 'server/middleware/0.prisma.ts',
      content: prismaServerMiddleware
    },
    {
      path: 'app/components/Welcome/PrismaDemo.vue',
      content: prismaDemoComponent,
    },
    {
      path: 'prisma/pglite.ts',
      content: pglite,
    }
  ],
  tasksPostInstall: [
    '- [ ] Prisma: Edit your `prisma/prisma.schema` to your liking',
    `- [ ] Prisma: Start your local postgres database using \`${getUserPkgManager()} run db\``,
    '- [ ] Prisma: Run `npx prisma db push` to sync the schema to your database & generate the Prisma Client',
    '- [ ] Prisma: Add `**/*/pglite-data` and `pgliteHealthz` to your `.gitignore` file'
  ],
  indexVue: generateModuleHTMLSnippet('WelcomePrismaDemo'),
}

export default prisma
