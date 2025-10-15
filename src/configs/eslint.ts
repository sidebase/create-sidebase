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
  stylistic: {
    indent: 2,
    quotes: 'single',
  },
  vue: true,
  jsonc: false,
  yaml: false,
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
  scripts: [
    {
      name: 'lint',
      command: 'oxlint --deny-warnings -D correctness -D suspicious -D perf && eslint --max-warnings 0 .'
    },
    {
      name: 'lint:fix',
      command: 'eslint . --fix',
    }
  ],
  dependencies: [
    {
      name: 'eslint',
      version: '^9.37.0',
      isDev: true
    },
    {
      name: '@antfu/eslint-config',
      version: '^5.4.1',
      isDev: true
    },
    {
      name: 'oxlint',
      version: '^1.20.0',
      isDev: true
    }
  ],
  nuxtConfig: {},
  files: [
    {
      path: 'eslint.config.js',
      content: eslintConfig
    }
  ],
}

export default eslint
