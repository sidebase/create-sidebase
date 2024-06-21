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
    version: '^2.0.7',
    isDev: true
  }, {
    name: 'typescript',
    version: '^5.4.3',
    isDev: true,
  }, {
    name: '@types/node',
    version: '^20.11.30',
    isDev: true,
  }],
  files: [],
  nuxtConfig: {
    typescript: {
      typeCheck: true
    }
  }
}

export default scripts
