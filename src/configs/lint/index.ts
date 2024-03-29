import type { PackageConfig } from "../index"

const eslintConfig = `import antfu from '@antfu/eslint-config'

export default antfu()`

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
