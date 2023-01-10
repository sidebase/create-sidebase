import { NuxtConfig } from "@nuxt/schema"
import { Dependency } from "../../utils/addPackageDependency"

/**
 * PRISMA FILE CONTENTS
 */
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
 * Fetch all \`examples\` from the database. Run \`npx prisma generate\` and \`npx prisma db push\` for this to work.
 *
 * If you are using \`tRPC\` you can access the prisma-client by adding it to the context:
 * \`\`\`ts
 * export async function createContext(event: H3Event) {
 *   return { prisma: event.context.prisma }
 * }
 *
 * export type Context = inferAsyncReturnType<typeof createContext>;
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

const prismaExamplePage = `<script setup lang="ts">
const { data: examples } = useFetch('/api/examples')
</script>

<template>
  <div>
    <p>Prisma ORM Data from the database, received {{ examples?.length || 0 }} records: <pre>{{ examples }}</pre></p>
  </div>
</template>
`

/**
 * NUXT AUTH FILE CONTENTS, from: sidebase.io/nuxt-auth/
 */
const nuxtAuthServerFile = `import CredentialsProvider from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'
import { NuxtAuthHandler } from '#auth'

export default NuxtAuthHandler({
  // TODO: ADD YOUR OWN AUTHENTICATION PROVIDER HERE, READ THE DOCS FOR MORE: https://sidebase.io/nuxt-auth
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    GithubProvider.default({
      clientId: process.env.GITHUB_CLIENT_ID || 'enter-your-client-id-here',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || 'enter-your-client-secret-here' // TODO: Replace this with an env var like "process.env.GITHUB_CLIENT_SECRET". The secret should never end up in your github repository
    }),
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    CredentialsProvider.default({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: '(hint: jsmith)' },
        password: { label: 'Password', type: 'password', placeholder: '(hint: hunter2)' }
      },
      authorize (credentials: any) {
        console.warn('ATTENTION: You should replace this with your real providers or credential provider logic! The current setup is not safe')
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // NOTE: THE BELOW LOGIC IS NOT SAFE OR PROPER FOR AUTHENTICATION!

        const user = { id: '1', name: 'J Smith', username: 'jsmith', password: 'hunter2' }

        if (credentials?.username === user.username && credentials?.password === user.password) {
          // Any object returned will be saved in \`user\` property of the JWT
          return user
        } else {
          console.error('Warning: Malicious login attempt registered, bad credentials provided')

          // If you return null then an error will be displayed advising the user to check their details.
          return null

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    })
  ]
})
`

const nuxtAuthExamplePage = `<template>
  <div>I'm protected! Session data: {{ data }}</div>
  <button @click="signOut()" class="rounded-xl shadow-xl p-2 m-2">sign out</button>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { data, signOut } = useSession()
</script>
`

/**
 * NUXT tRPC FILE CONTENTS, from: https://trpc-nuxt.vercel.app/get-started/usage/simple
 */
const nuxtTrpcRootConfig = `/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - \`initTRPC\` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @see https://trpc.io/docs/v10/router
 * @see https://trpc.io/docs/v10/procedures
 */
import { initTRPC } from '@trpc/server'
import { Context } from '~/server/trpc/context'
import superjson from 'superjson';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
})

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure;
export const router = t.router;
export const middleware = t.middleware;
`

const nuxtTrpcRoutersIndex = `import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

export const appRouter = router({
  hello: publicProcedure
    .input(
      z.object({
        text: z.string().nullish(),
      }),
    )
    .query(({ input }) => {
      return {
        greeting: \`hello \${input?.text ?? "world"}\`,
        time: new Date()
      }
    }),
})

// export type definition of API
export type AppRouter = typeof appRouter
`

const nuxtTrpcContext = `import { inferAsyncReturnType } from '@trpc/server'
import type { H3Event } from 'h3'

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(event: H3Event) {
  /**
   * Add any trpc-request context here. E.g., you could add \`prisma\` like this (if you've added it via sidebase):
   * \`\`\`ts
   * return { prisma: event.context.prisma }
   * \`\`\`
   */
  return {}
}

export type Context = inferAsyncReturnType<typeof createContext>;
`

const nuxtTrpcApiHandler = `import { createNuxtApiHandler } from 'trpc-nuxt'
import { appRouter } from '~/server/trpc/routers'
import { createContext } from '~/server/trpc/context'

// export API handler
export default createNuxtApiHandler({
  router: appRouter,
  createContext,
})
`

const nuxtTrpcPlugin = `import { createTRPCNuxtClient, httpBatchLink } from "trpc-nuxt/client"
import type { AppRouter } from "~/server/trpc/routers"
import superjson from 'superjson';

export default defineNuxtPlugin(() => {
  /**
   * createTRPCNuxtClient adds a \`useQuery\` composable
   * built on top of \`useAsyncData\`.
   */
  const client = createTRPCNuxtClient<AppRouter>({
    transformer: superjson,
    links: [
      httpBatchLink({
        url: "/api/trpc",
      }),
    ],
  })

  return {
    provide: {
      client,
    },
  }
})
`

const nuxtTrpcExamplePage = `<script setup lang="ts">
const { $client } = useNuxtApp()

const hello = await $client.hello.useQuery({ text: 'client' })
</script>

<template>
  <div>
    <!-- As \`superjson\` is already pre-configured, we can use \`time\` as a \`Date\` object without further deserialization 🎉 -->
    <p>tRPC Data: "{{ hello.data.value?.greeting }}" send at "{{ hello.data.value?.time.toLocaleDateString() }}".</p>
  </div>
</template>
`

export declare interface File {
  path: string;
  content: string;
}

declare interface ModuleConfig {
  humanReadableName: string
  description: string
  dependencies: Dependency[]
  nuxtConfig: NuxtConfig
  files: File[]
  tasksPostInstall: string[]
  htmlForIndexVue?: string
}

// TODO: Improve files approach: It will fail as soon as the content of a file depends on two dependencies at the same time!
export type Modules = "prisma" | "auth" | "trpc" | "tailwind" | "naiveui"
export const moduleConfigs: Record<Modules, ModuleConfig> = {
  "prisma": {
    humanReadableName: "Prisma ORM",
    description: "Next-generation Node.js and TypeScript ORM. See more: https://www.prisma.io/",
    dependencies: [
      {
        name: "prisma",
        version: "^4.8.0",
        isDev: true
      },
      {
        name: "@prisma/client",
        version: "^4.8.0",
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
      path: "pages/prisma.vue",
      content: prismaExamplePage
    }],
    tasksPostInstall: [
      "- [ ] Prisma: Edit your `prisma/prisma.schema` to your liking",
      "- [ ] Prisma: Run `npx prisma db push` to sync the schema to your database after changing the schema",
      "- [ ] Prisma: Run `npx prisma generate` to re-generate the client after changing the schema"
    ],
    htmlForIndexVue: "<p>Checkout the Prisma ORM demo page here: <nuxt-link to=\"/prisma\" class=\"underline text-blue\">Click me to test the Prisma ORM setup!</nuxt-link></p>"
  },
  "auth": {
    humanReadableName: "nuxt-auth",
    description: "Authentication via OAuth, Credentials and magic email flows. Wraps the popular NextAuth.js with 12k stars. See more: https://sidebase.io/nuxt-auth",
    dependencies: [
      {
        name: "@sidebase/nuxt-auth",
        version: "^0.3.3",
        isDev: true
      },
    ],
    nuxtConfig: {
      modules: ["@sidebase/nuxt-auth"]
    },
    files: [{
      path: "server/api/auth/[...].ts",
      content: nuxtAuthServerFile
    }, {
      path: "pages/protected.vue",
      content: nuxtAuthExamplePage
    }],
    tasksPostInstall: [
      "- [ ] Auth: Configure your auth providers to the [NuxtAuthHandler](./server/api/auth/[...].ts)",
      "- [ ] Auth, optional: Enable global protection by setting `enableGlobalAppMiddleware: true` in [your nuxt.config.ts](./nuxt.config.ts). Delete the logal middleware in the [protected.vue](./pages/protected.vue) page if you do"
    ],
    htmlForIndexVue: "<p>Checkout the page protected by `nuxt-auth` here: <nuxt-link to=\"/protected\" class=\"underline text-blue\">Click me to test the auth setup!</nuxt-link></p>"
  },
  "trpc": {
    humanReadableName: "tRPC 10",
    description: "Build end-to-end typesafe APIs in Nuxt applications. See more: https://trpc.io/",
    dependencies: [{
      name: "@trpc/server",
      version: "^10.5.0",
      isDev: false
    }, {
      name: "@trpc/client",
      version: "^10.5.0",
      isDev: false
    }, {
      name: "trpc-nuxt",
      version: "^0.4.4",
      isDev: false
    }, {
      name: "zod",
      version: "^3.20.2",
      isDev: false
    }, {
      name: "superjson",
      version: "^1.12.1",
      isDev: false
    }],
    nuxtConfig: {
      build: {
        transpile: ["trpc-nuxt"]
      }
    },
    files: [
      {
        path: "server/trpc/trpc.ts",
        content: nuxtTrpcRootConfig
      },
      {
        path: "server/trpc/routers/index.ts",
        content: nuxtTrpcRoutersIndex
      },
      {
        path: "server/trpc/context.ts",
        content: nuxtTrpcContext
      },
      {
        path: "server/api/trpc/[trpc].ts",
        content: nuxtTrpcApiHandler
      },
      {
        path: "plugins/trpcClient.ts",
        content: nuxtTrpcPlugin
      },
      {
        path: "pages/trpc.vue",
        content: nuxtTrpcExamplePage
      },
    ],
    tasksPostInstall: [],
    htmlForIndexVue: "<p>Checkout the tRPC demo page here: <nuxt-link to=\"/trpc\" class=\"underline text-blue\">Click me to test the tRPC setup!</nuxt-link></p>"
  },
  "tailwind": {
    humanReadableName: "Tailwind CSS",
    description: "A utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup. See more: https://tailwindcss.com/",
    dependencies: [{
      name: "@nuxtjs/tailwindcss",
      version: "^6.1.3",
      isDev: true
    }],
    nuxtConfig: {
      modules: ["@nuxtjs/tailwindcss"]
    },
    files: [],
    tasksPostInstall: []
  },
  "naiveui": {
    humanReadableName: "Naive UI",
    description: "A Vue 3 Component Library. Fairly Complete, Theme Customizable, Uses TypeScript, Fast. Kinda Interesting. See more: https://www.naiveui.com/",
    dependencies: [{
      name: "@huntersofbook/naive-ui-nuxt",
      version: "^0.5.1",
      isDev: true
    }],
    nuxtConfig: {
      modules: ["@huntersofbook/naive-ui-nuxt"],
    },
    files: [],
    tasksPostInstall: []
  }
}
