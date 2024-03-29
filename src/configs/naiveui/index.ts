import { generateModuleHTMLComponent, generateModuleHTMLSnippet } from "../../generators/generateModuleComponents"
import type { PackageConfig } from "../index"

const naiveDemoComponent = `<script setup lang="ts">
const showModal = ref(false)
</script>
<template>
  ${generateModuleHTMLComponent(
    "NaiveUI",
    "A Vue 3 Component Library. Complete, Customizable, Uses TypeScript, Fast.",
    "https://www.naiveui.com/en-US/os-theme",
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

const naiveui: PackageConfig = {
  humanReadableName: "Naive UI",
  description: "A Vue 3 Component Library. Complete, Customizable, Uses TypeScript, Fast. See more: https://www.naiveui.com/",
  dependencies: [{
    name: "@bg-dev/nuxt-naiveui",
    version: "^1.8.1",
    isDev: true
  }],
  nuxtConfig: {
    modules: ["@bg-dev/nuxt-naiveui"],
  },
  files: [{
    path: "components/Welcome/NaiveDemo.vue",
    content: naiveDemoComponent
  }],
  tasksPostInstall: [],
  indexVue: generateModuleHTMLSnippet("WelcomeNaiveDemo"),
}

export default naiveui
