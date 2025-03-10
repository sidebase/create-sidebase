import { generateModuleHTMLComponent, generateModuleHTMLSnippet } from '../generators/generateModuleComponents'
import type { ModuleConfig } from '../types'

const naiveDemoComponent = `<script setup lang="ts">
const showModal = ref(false)
</script>

<template>
  ${generateModuleHTMLComponent(
    'NaiveUI',
    'A Vue 3 Component Library. Complete, Customizable, Uses TypeScript, Fast.',
    'https://www.naiveui.com/en-US/os-theme',
    `<n-modal v-model:show="showModal">
        <n-card
          style="width: 600px"
          title="NaiveUI + sidebase = ❤️"
          role="dialog"
          aria-modal="true"
        >
          Its this simple! You can now begin using any NaiveUI component in your project!
        </n-card>
      </n-modal>`,
    `<WelcomeButtonLink @click="showModal = true">
          Open modal
        </WelcomeButtonLink>`,
  ).html}
</template>
`

const nuxtAppVueWithNaiveConfig = `<template>
  <NaiveConfig>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </NaiveConfig>
</template>
`

const naiveui: ModuleConfig = {
  humanReadableName: 'Naive UI',
  description: 'A Vue 3 Component Library. Complete, Customizable, Uses TypeScript, Fast. See more: https://www.naiveui.com/',
  scripts: [],
  dependencies: [
    {
      name: '@bg-dev/nuxt-naiveui',
      version: '2.0.0-rc.4',
      isDev: true
    }
  ],
  nuxtConfig: {
    modules: ['@bg-dev/nuxt-naiveui'],
  },
  files: [
    {
      path: 'components/Welcome/NaiveDemo.vue',
      content: naiveDemoComponent
    },
    {
      path: 'app.vue',
      content: nuxtAppVueWithNaiveConfig
    }
  ],
  tasksPostInstall: [],
  indexVue: generateModuleHTMLSnippet('WelcomeNaiveDemo'),
}

export default naiveui
