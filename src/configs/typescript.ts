import type { Config } from '../types'

const scripts: Config = {
  scripts: [{
    name: 'typecheck',
    command: 'nuxt typecheck'
  }, {
    name: 'start',
    command: 'NODE_ENV=production node .output/server/index.mjs'
  }],
  dependencies: [
    {
      name: 'vue-tsc',
      version: '3.0.6',
      isDev: true
    },
    {
      name: 'typescript',
      version: '5.9.2',
      isDev: true,
    }
  ],
  files: [],
  nuxtConfig: {}
}

export default scripts
