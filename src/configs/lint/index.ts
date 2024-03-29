import type { PackageConfig } from "../index"

const eslintConfig = `import antfu from '@antfu/eslint-config'

const ignores = [
  '.nuxt',
  '**/.nuxt/**',
  '.output',
  '**/.output/**',
  'node_modules',
  '**/node_modules/**',
  'public',
  '**/public/**',
]

export default antfu({
  // .eslintignore is no longer supported in Flat config, use ignores instead
  ignores,

  // Stylistic formatting rules
  stylistic: {
    indent: 2,
    quotes: 'single',
  },

  // TypeScript and Vue are auto-detected, you can also explicitly enable them:
  typescript: true,
  vue: true,

  // Disable jsonc and yaml support
  jsonc: false,
  yaml: false,
})`

const lint: PackageConfig = {
  type: "template",
  humanReadableName: "ESLint",
  description: "Lint your code.",
  scripts: [{
    name: "lint",
    command: "eslint ."
  }, {
    name: "lint:fix",
    command: "eslint . --fix",
  }],
  dependencies: [{
    name: "eslint",
    version: "^8.57.0",
    isDev: true
  }, {
    name: "@antfu/eslint-config",
    version: "^2.11.5",
    isDev: true
  }],
  nuxtConfig: {},
  files: [{
    path: "eslint.config.ts",
    content: eslintConfig
  }],
  tasksPostInstall: [],
}

export default lint
