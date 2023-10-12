import { NuxtConfig } from "@nuxt/schema"
import { Dependency } from "../../utils/addPackageDependency"

// Import Module Configs
import prisma from "./moduleConfigs/prisma"
import auth from "./moduleConfigs/auth"
import trpc from "./moduleConfigs/trpc"
import tailwind from "./moduleConfigs/tailwind"
import naiveui from "./moduleConfigs/naiveui"
import drizzle from "./moduleConfigs/drizzle"

export declare interface File {
  path: string;
  content: string;
}

export declare interface ModuleConfig {
  humanReadableName: string
  description: string
  dependencies: Dependency[]
  nuxtConfig: NuxtConfig
  files: File[]
  tasksPostInstall: string[]
  indexVue?: {
    html: string,
    css?: string
    js?: string,
  }
}

// TODO: Improve files approach: It will fail as soon as the content of a file depends on two dependencies at the same time!
export type Modules = "prisma" | "drizzle" | "auth" | "trpc" | "tailwind" | "naiveui"
export const moduleConfigs: Record<Modules, ModuleConfig> = {
  "prisma": prisma,
  "drizzle": drizzle,
  "auth": auth,
  "trpc": trpc,
  "tailwind": tailwind,
  "naiveui": naiveui
}
