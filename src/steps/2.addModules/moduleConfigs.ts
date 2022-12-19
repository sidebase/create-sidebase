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
