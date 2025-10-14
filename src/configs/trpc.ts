import { generateModuleHTMLComponent, generateModuleHTMLSnippet } from '../generators/generateModuleComponents'
import type { ModuleConfig } from '../types'

const nuxtTrpcRootConfig = `/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - \`initTRPC\` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @see https://trpc.io/docs/v10/router
 * @see https://trpc.io/docs/v10/procedures
 */
import type { Context } from '~~/server/trpc/context'
import { initTRPC } from '@trpc/server'
import superjson from 'superjson'

const t = initTRPC.context<Context>().create({
  transformer: superjson
})

/**
 * Unprotected procedure
 */
export const publicProcedure = t.procedure
export const router = t.router
export const middleware = t.middleware
`

const nuxtTrpcRoutersIndex = `import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

export const appRouter = router({
  hello: publicProcedure
    .input(
      z.object({
        text: z.string().nullish()
      })
    )
    .query(({ input }) => {
      return {
        greeting: \`hello \${input?.text ?? 'world'}\`,
        time: new Date()
      }
    })
})

// export type definition of API
export type AppRouter = typeof appRouter
`

const nuxtTrpcContext = `import type { inferAsyncReturnType } from '@trpc/server'
import type { H3Event } from 'h3'

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export function createContext(_event: H3Event) {
  /**
   * Add any trpc-request context here. E.g., you could add \`prisma\` like this (if you've added it via sidebase):
   * \`\`\`ts
   * return { prisma: _event.context.prisma }
   * \`\`\`
   */
  return {}
}

export type Context = inferAsyncReturnType<typeof createContext>
`

const nuxtTrpcApiHandler = `import { createNuxtApiHandler } from 'trpc-nuxt'
import { createContext } from '~~/server/trpc/context'
import { appRouter } from '~~/server/trpc/routers'

// export API handler
export default createNuxtApiHandler({
  router: appRouter,
  createContext
})
`

const nuxtTrpcPlugin = `import type { AppRouter } from '~~/server/trpc/routers'
import superjson from 'superjson'
import { createTRPCNuxtClient, httpBatchLink } from 'trpc-nuxt/client'

export default defineNuxtPlugin(() => {
  /**
   * createTRPCNuxtClient adds a \`useQuery\` composable
   * built on top of \`useAsyncData\`.
   */
  const client = createTRPCNuxtClient<AppRouter>({
    transformer: superjson,
    links: [
      httpBatchLink({
        url: '/api/trpc'
      })
    ]
  })

  return {
    provide: {
      client
    }
  }
})
`

const trpcDemoComponent = `<script lang="ts" setup>
const { $client } = useNuxtApp()

const hello = await $client.hello.useQuery({ text: 'client' })
</script>

<template>
  ${generateModuleHTMLComponent(
    'tRPC',
    'tRPC allows you to easily build & consume fully typesafe APIs without schemas or code generation.',
    'https://sidebase.io/sidebase/components/trpc',
    `<p>
        <!-- As superjson is already pre-configured, we can use time as a Date object without further deserialization 🎉 -->
        tRPC Data: "{{ hello.data.value?.greeting }}" send at "{{ hello.data.value?.time.toLocaleDateString('en-EN') }}".
      </p>`,
    '',
  ).html}
</template>
`

const trpc: ModuleConfig = {
  humanReadableName: 'tRPC 10',
  description: 'Build end-to-end typesafe APIs in Nuxt applications. See more: https://trpc.io/',
  scripts: [],
  dependencies: [
    {
      name: '@trpc/server',
      version: '^11.5.1',
      isDev: false
    },
    {
      name: '@trpc/client',
      version: '^11.5.1',
      isDev: false
    },
    {
      name: 'trpc-nuxt',
      version: '^1.2.0',
      isDev: false
    },
    {
      name: 'zod',
      version: '^4.1.12',
      isDev: false
    },
    {
      name: 'superjson',
      version: '^2.2.2',
      isDev: false
    }
  ],
  nuxtConfig: {
    build: {
      transpile: ['trpc-nuxt']
    }
  },
  files: [
    {
      path: 'server/trpc/trpc.ts',
      content: nuxtTrpcRootConfig
    },
    {
      path: 'server/trpc/routers/index.ts',
      content: nuxtTrpcRoutersIndex
    },
    {
      path: 'server/trpc/context.ts',
      content: nuxtTrpcContext
    },
    {
      path: 'server/api/trpc/[trpc].ts',
      content: nuxtTrpcApiHandler
    },
    {
      path: 'app/plugins/trpcClient.ts',
      content: nuxtTrpcPlugin
    },
    {
      path: 'app/components/Welcome/TRPCDemo.vue',
      content: trpcDemoComponent,
    }
  ],
  tasksPostInstall: [],
  indexVue: generateModuleHTMLSnippet('WelcomeTRPCDemo'),
}

export default trpc
