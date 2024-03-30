import type { Config } from '../types'

// nuxt 3 + pnpm needs to shamefully hoist + we want to auto-install required peer dependencies (last one taken from: https://github.com/antfu/vitesse/blob/main/.npmrc)
const npmrc = `
shamefully-hoist=true
strict-peer-dependencies=false
`

const pnpm: Config = {
  dependencies: [],
  scripts: [],
  nuxtConfig: {},
  files: [{
    path: '.npmrc',
    content: npmrc
  }],
}

export default pnpm
