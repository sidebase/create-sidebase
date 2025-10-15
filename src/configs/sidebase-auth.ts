import { generateModuleHTMLComponent, generateModuleHTMLSnippet } from '../generators/generateModuleComponents'
import type { ModuleConfig } from '../types'

const nuxtAuthServerFile = `import { NuxtAuthHandler } from '#auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'

export default NuxtAuthHandler({
  // TODO: SET A STRONG SECRET, SEE https://sidebase.io/nuxt-auth/configuration/nuxt-auth-handler#secret
  secret: process.env.AUTH_SECRET,
  // TODO: ADD YOUR OWN AUTHENTICATION PROVIDER HERE, READ THE DOCS FOR MORE: https://sidebase.io/nuxt-auth
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    GithubProvider.default({
      clientId: process.env.GITHUB_CLIENT_ID || 'enter-your-client-id-here',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || 'enter-your-client-secret-here', // TODO: Replace this with an env var like "process.env.GITHUB_CLIENT_SECRET". The secret should never end up in your github repository
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
        password: { label: 'Password', type: 'password', placeholder: '(hint: hunter2)' },
      },
      authorize(credentials: any) {
        console.warn('ATTENTION: You should replace this with your real providers or credential provider logic! The current setup is not safe')
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // NOTE: THE BELOW LOGIC IS NOT SAFE OR PROPER FOR AUTHENTICATION!

        const user = { id: '1', name: 'J Smith', username: 'jsmith', password: 'hunter2' }

        if (credentials?.username === user.username && credentials?.password === user.password) {
          // Any object returned will be saved in \`user\` property of the JWT
          return user
        }
        else {
          console.error('Warning: Malicious login attempt registered, bad credentials provided')

          // If you return null then an error will be displayed advising the user to check their details.
          return null

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],
})
`

const authDemoComponent = `<script lang="ts" setup>
const { status, data, signIn, signOut } = useAuth()
</script>

<template>
  ${generateModuleHTMLComponent(
    'Authentication',
    'Nuxt user authentication and sessions through nuxt-auth. nuxt-auth wraps NextAuth.js to offer the reliability & convenience of a 12k star library to the nuxt 3 ecosystem with a native developer experience (DX)',
    'https://sidebase.io/nuxt-auth/getting-started',
    `<p v-if="status === 'authenticated'">
        Logged in as "{{ data?.user?.name }}"
      </p>
      <p v-else>
        Not logged in.
      </p>`,
    `<WelcomeButtonLink v-if="status !== 'authenticated'" @click="signIn">
          Sign in
        </WelcomeButtonLink>
        <WelcomeButtonLink v-else @click="signOut">
          Sign out
        </WelcomeButtonLink>`,
  ).html}
</template>
`

const sidebaseAuth: ModuleConfig = {
  humanReadableName: 'nuxt-auth',
  description: 'Authentication via OAuth, Credentials and magic email flows. Wraps the popular NextAuth.js with 12k stars. See more: https://sidebase.io/nuxt-auth',
  scripts: [],
  dependencies: [
    {
      name: '@sidebase/nuxt-auth',
      version: '^1.1.0',
      isDev: true
    },
    {
      name: 'next-auth',
      version: '4.21.1',
      isDev: false,
      isPeer: true,
    }
  ],
  nuxtConfig: {
    modules: ['@sidebase/nuxt-auth'],
  },
  files: [
    {
      path: 'server/api/auth/[...].ts',
      content: nuxtAuthServerFile
    },
    {
      path: 'app/components/Welcome/AuthDemo.vue',
      content: authDemoComponent
    }
  ],
  tasksPostInstall: [
    '- [ ] Auth: Configure your auth providers to the [NuxtAuthHandler](./server/api/auth/[...].ts)',
    '- [ ] Auth, optional: Enable global protection by setting `enableGlobalAppMiddleware: true` in [your nuxt.config.ts](./nuxt.config.ts). Delete the local middleware in the [protected.vue](./pages/protected.vue) page if you do'
  ],
  indexVue: generateModuleHTMLSnippet('WelcomeAuthDemo'),
}

export default sidebaseAuth
