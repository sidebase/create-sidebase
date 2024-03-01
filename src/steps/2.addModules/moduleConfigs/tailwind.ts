import { generateModuleHTMLComponent, generateModuleHTMLSnippet } from "../generateModuleComponents"
import type { ModuleConfig } from "../moduleConfigs"

const tailwindDemoComponent = `<template>
  ${generateModuleHTMLComponent(
    "TailwindCSS",
    "Rapidly build modern websites without ever leaving your HTML.",
    "https://sidebase.io/sidebase/components/tailwindcss",
    "",
    `<WelcomeButtonLink  href="/_tailwind/" :blank="true">
        Tailwind viewer
      </WelcomeButtonLink>`,
  ).html}
</template>
`

const tailwind: ModuleConfig = {
  humanReadableName: "Tailwind CSS",
  description: "A utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup. See more: https://tailwindcss.com/",
  dependencies: [{
    name: "@nuxtjs/tailwindcss",
    version: "^6.10.4",
    isDev: true
  }],
  nuxtConfig: {
    modules: ["@nuxtjs/tailwindcss"]
  },
  files: [{
    path: "components/Welcome/TailwindDemo.vue",
    content: tailwindDemoComponent,
  }],
  tasksPostInstall: [],
  indexVue: generateModuleHTMLSnippet("WelcomeTailwindDemo"),
}

export default tailwind
