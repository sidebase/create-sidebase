import type { NuxtConfig } from '@nuxt/schema'
import type { Dependency, Script } from '../utils/addPackageDependency'
import prisma from './prisma'
import auth from './auth'
import trpc from './trpc'
import tailwind from './tailwind'
import naiveui from './naiveui'
import lint from './lint'

export declare interface File {
  path: string
  content: string
}

export declare interface PackageConfig {
  type: 'module' | 'template'
  humanReadableName: string
  description: string
  dependencies: Dependency[]
  scripts: Script[]
  nuxtConfig: NuxtConfig
  files: File[]
  tasksPostInstall: string[]
  indexVue?: {
    html: string
    css?: string
    js?: string
  }
}

// Package options
export type Packages = 'prisma' | 'auth' | 'trpc' | 'tailwind' | 'naiveui' | 'lint'
export const packageConfigs: Record<Packages, PackageConfig> = {
  prisma,
  auth,
  trpc,
  tailwind,
  naiveui,
  lint
}
