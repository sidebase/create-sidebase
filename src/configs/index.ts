import type { Config, ModuleConfig } from '../types'
import tailwind from './tailwind'
import naiveui from './naiveui'
import prisma from './prisma'
import trpc from './trpc'
import sidebaseAuth from './sidebase-auth'
import eslint from './eslint'
import githubActions from './github-actions'
import scripts from './scripts'

export type Modules = 'prisma' | 'sidebase-auth' | 'trpc' | 'tailwind' | 'naiveui'
export const modules: Record<Modules, ModuleConfig> = {
  'tailwind': tailwind,
  'naiveui': naiveui,
  'prisma': prisma,
  'trpc': trpc,
  'sidebase-auth': sidebaseAuth
}

export type Configs = 'eslint' | 'github-actions' | 'scripts'
export const configs: Record<Configs, Config> = {
  'eslint': eslint,
  'github-actions': githubActions,
  'scripts': scripts
}
