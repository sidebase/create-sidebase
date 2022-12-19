import { Dependency } from "../../utils/addPackageDependency"

export type SupportedDependencies = "tailwind" | "naiveui" | "prisma" | "auth"

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

const nuxtAuthServerFile = `import { NuxtAuthHandler } from '#auth'
import GithubProvider from 'next-auth/providers/github'

export default NuxtAuthHandler({
  // TODO: ADD YOUR OWN AUTHENTICATION PROVIDER HERE, READ THE DOCS FOR MORE: https://sidebase.io/nuxt-auth
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    GithubProvider.default({
      clientId: process.env.GITHUB_CLIENT_ID || 'enter-your-client-id-here',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || 'enter-your-client-secret-here' // TODO: Replace this with an env var like "process.env.GITHUB_CLIENT_SECRET". The secret should never end up in your github repository
    })
  ]
})
`

const nuxtAuthExamplePage = `<template>
  <div>I'm protected!</div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
</script>
`

const nuxtAuthApp = `<template>
<div>
  <NuxtPage />
</div>
</template>
`

const nuxtAuthIndexPage = `<template>
  <div>
    <h1>Welcome to your sidebase app!</h1>
    <p>This is an example page you can remove or overwrite. <nuxt-link to="/protected">Checkout the protected page to test your authentication setup!</nuxt-link> This will only work properly if you configured your authentication providers in the \`NuxtAuthHandler\`.</p>
  </div>
</template>
`

export declare interface File {
  path: string;
  content: string;
}

declare interface ModuleConfig {
  humanReadableName: string
  dependencies: Dependency[]
  nuxtModuleNames: string[]
  nuxtExtendsNames: string[]
  files: File[]
}

// TODO: Improve files approach: It will fail as soon as the content of a file depends on two dependencies at the same time!
export const moduleConfigs: Record<SupportedDependencies, ModuleConfig> = {
  "tailwind": {
    humanReadableName: "Tailwind CSS",
    dependencies: [{
      name: "@nuxtjs/tailwindcss",
      version: "^6.1.3",
      isDev: true
    }],
    nuxtModuleNames: ["@nuxtjs/tailwindcss"],
    nuxtExtendsNames: [],
    files: []
  },
  "naiveui": {
    humanReadableName: "Naive UI",
    dependencies: [{
      name: "@huntersofbook/naive-ui-nuxt",
      version: "^0.5.1",
      isDev: true
    }],
    nuxtModuleNames: ["@huntersofbook/naive-ui-nuxt"],
    nuxtExtendsNames: [],
    files: []
  },
  "prisma": {
    humanReadableName: "Prisma ORM",
    dependencies: [
      {
        name: "prisma",
        version: "^4.7.1",
        isDev: true
      },
      {
        name: "@prisma/client",
        version: "^4.7.1",
        isDev: false
      },
      {
        name: "@sidebase/nuxt-prisma",
        version: "^0.1.0",
        isDev: false
      }
    ],
    nuxtModuleNames: [],
    nuxtExtendsNames: ["@sidebase/nuxt-prisma"],
    files: [{
      path: ".env",
      content: prismaEnvFile
    }, {
      path: "prisma/schema.prisma",
      content: prismaFile
    }]
  },
  "auth": {
    humanReadableName: "nuxt-auth",
    dependencies: [
      {
        name: "@sidebase/nuxt-auth",
        version: "^0.3.0",
        isDev: true
      },
    ],
    nuxtModuleNames: ["@sidebase/nuxt-auth"],
    nuxtExtendsNames: [],
    files: [{
      path: "server/api/auth/[...].ts",
      content: nuxtAuthServerFile
    }, {
      path: "pages/protected.vue",
      content: nuxtAuthExamplePage
    }, {
      path: "app.vue",
      content: nuxtAuthApp
    }, {
      path: "pages/index.vue",
      content: nuxtAuthIndexPage
    }]
  }
}
