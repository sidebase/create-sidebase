import type { Config, ModuleConfig } from '../types'
import droneCI from './droneCI'
import eslint from './eslint'
import githubActions from './github-actions'
import i18n from './i18n'
import naiveui from './naiveui'
import pnpm from './pnpm'
import prisma from './prisma'
import sidebaseAuth from './sidebase-auth'
import tailwind from './tailwind'
import trpc from './trpc'
import typescript from './typescript'
import vscode from './vscode'

export type Modules = 'prisma' | 'sidebase-auth' | 'trpc' | 'tailwind' | 'naiveui' | 'i18n'
export const modules: Record<Modules, ModuleConfig> = {
  'tailwind': tailwind,
  'naiveui': naiveui,
  'prisma': prisma,
  'trpc': trpc,
  'sidebase-auth': sidebaseAuth,
  'i18n': i18n
}

export type Configs = 'eslint' | 'github-actions' | 'typescript' | 'pnpm' | 'vscode' | 'droneCI'
export const configs: Record<Configs, Config> = {
  'eslint': eslint,
  'github-actions': githubActions,
  'typescript': typescript,
  'pnpm': pnpm,
  'vscode': vscode,
  'droneCI': droneCI
}
