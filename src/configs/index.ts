import type { NuxtConfig } from "@nuxt/schema"
import type { Dependency } from "../utils/addPackageDependency"
import prisma from "./prisma"
import auth from "./auth"
import trpc from "./trpc"
import tailwind from "./tailwind"
import naiveui from "./naiveui"

export declare interface File {
  path: string;
  content: string;
}

export declare interface PackageConfig {
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

export type Modules = "prisma" | "auth" | "trpc" | "tailwind" | "naiveui"
export const moduleConfigs: Record<Modules, PackageConfig> = {
  "prisma": prisma,
  "auth": auth,
  "trpc": trpc,
  "tailwind": tailwind,
  "naiveui": naiveui
}
