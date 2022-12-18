import { getResolver } from "../getResolver"
import { moduleConfigs, Preferences, SupportedDependencies } from "../prompts"
import { addPackageDependencies, Dependency } from "../utils/addPackageDependency"
import { writeFile, mkdir } from "node:fs/promises"

export default async (preferences: Preferences, templateDir: string) => {
  const selectedModules: SupportedDependencies[] = preferences.addModules
  if (!selectedModules || selectedModules.length === 0) {
    return
  }

  const resolver = getResolver(templateDir)


  let dependencies: Dependency[] = []
  let modulesForNuxt: string[] = []
  let extendsForNuxt: string[] = []

  // 1.1 Tailwind
  if (selectedModules.includes("tailwind")) {
    dependencies = [...dependencies, ...moduleConfigs["tailwind"].dependencies]
    modulesForNuxt = modulesForNuxt.concat(moduleConfigs["tailwind"].nuxtModuleNames)
    extendsForNuxt = extendsForNuxt.concat(moduleConfigs["tailwind"].nuxtExtendsNames)
  }

  // 1.2 Naive UI
  if (selectedModules.includes("naiveui")) {
    dependencies = [...dependencies, ...moduleConfigs["naiveui"].dependencies]
    modulesForNuxt = modulesForNuxt.concat(moduleConfigs["naiveui"].nuxtModuleNames)
    extendsForNuxt = extendsForNuxt.concat(moduleConfigs["naiveui"].nuxtExtendsNames)
  }

  // 1.3 Prisma
  if (selectedModules.includes("prisma")) {
    dependencies = [...dependencies, ...moduleConfigs["prisma"].dependencies]
    modulesForNuxt = modulesForNuxt.concat(moduleConfigs["prisma"].nuxtModuleNames)
    extendsForNuxt = extendsForNuxt.concat(moduleConfigs["prisma"].nuxtExtendsNames)
  }

  addPackageDependencies({
    projectDir: preferences.setProjectName,
    dependencies
  })

  // 2. Write nuxt config
  const modulesForNuxtFormatted = `[${modulesForNuxt.map(module => `"${module}"`).join(", ")}]`
  const extendsForNuxtFormatted = `[${extendsForNuxt.map(module => `"${module}"`).join(", ")}]`
  const nuxtConfig = `
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ${modulesForNuxtFormatted},
  extends: ${extendsForNuxtFormatted},
})
`
  await writeFile(resolver("nuxt.config.ts"), nuxtConfig)

  // 3. Extra module configuration
  const prismaFile = `
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Example {
  id          String @id @default(uuid())
  details     String
}
`
  const prismaEnvFile = `
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"%
  `
  if (selectedModules.includes("prisma")) {
    await mkdir(resolver("prisma"))
    await writeFile(resolver("prisma/schema.prisma"), prismaFile)
    await writeFile(resolver(".env"), prismaEnvFile)
  }
}
