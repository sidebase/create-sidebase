import type { Config } from '../types'

const scripts: Config = {
  scripts: [{
    name: 'typecheck',
    command: 'nuxt typecheck'
  }, {
    name: 'start',
    command: 'NODE_ENV=production node .output/server/index.mjs'
  }],
  dependencies: [],
  files: [],
  nuxtConfig: {}
}

export default scripts
