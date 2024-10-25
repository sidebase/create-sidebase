import type { Config } from '../types'

const scripts: Config = {
  scripts: [{
    name: 'typecheck',
    command: 'nuxt typecheck'
  }, {
    name: 'start',
    command: 'NODE_ENV=production node .output/server/index.mjs'
  }],
  dependencies: [{
    name: 'vue-tsc',
    version: '^2.1.6',
    isDev: true
  }, {
    name: 'typescript',
    version: '^5.6.3',
    isDev: true,
  }, {
    name: '@types/node',
    version: '^22.7.8',
    isDev: true,
  }],
  files: [],
  nuxtConfig: {}
}

export default scripts
