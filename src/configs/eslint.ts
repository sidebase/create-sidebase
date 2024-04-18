import type { Config } from '../types'

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

  // TypeScript and Vue are auto-detected, you can also explicitly enable them
  typescript: true,
  vue: true,

  // Disable jsonc and yaml support
  jsonc: false,
  yaml: false,

  // Overwrite certain rules to your preference
  rules: {
    'no-console': ['error', {
      allow: ['info', 'warn', 'trace', 'error', 'group', 'groupEnd'],
    }],
    'style/comma-dangle': 'off',
    'curly': ['error', 'all'],
    'node/prefer-global/process': ['error', 'always'],
  },
})
`

const eslint: Config = {
  scripts: [{
    name: 'lint',
    command: 'oxlint --deny-warnings -D correctness -D suspicious -D perf && eslint --max-warnings 0 .'
  }, {
    name: 'lint:fix',
    command: 'eslint . --fix',
  }],
  dependencies: [{
    name: 'eslint',
    version: '^8.57.0',
    isDev: true
  }, {
    name: '@antfu/eslint-config',
    version: '^2.11.5',
    isDev: true
  }, {
    name: 'oxlint',
    version: '^0.2.15',
    isDev: true
  }],
  nuxtConfig: {},
  files: [{
    path: 'eslint.config.js',
    content: eslintConfig
  }],
}

export default eslint
