import { generateModuleHTMLComponent, generateModuleHTMLSnippet } from "../generateModuleComponents"
import type { ModuleConfig } from "../moduleConfigs"

const drizzleConfig = `import type { Config } from 'drizzle-kit'

export default {
  schema: './db/schema.ts',
  out: './drizzle',
  driver: 'better-sqlite',
  dbCredentials: {
    url: 'sqlite.db'
  }
} satisfies Config
`

const drizzleSchema = `import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  age: integer('age'),
  createdAt: text('created_at').default(sql\`CURRENT_TIMESTAMP\`)
})

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert
`

const drizzleService = `import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from '../../db/schema'

export const sqlite = new Database('sqlite.db')
export const db = drizzle(sqlite, { schema })
`

const drizzleAPIGet = `import { eq } from 'drizzle-orm'
import { db } from './sqlite-service'

export default defineEventHandler(async () => {
  try {
    const usersResp = await db.query.users.findMany({
      where: users => eq(users.firstName, 'Zoey')
    })
    return usersResp
  } catch (e: any) {
    throw createError({
      statusCode: 400,
      statusMessage: e.message
    })
  }
})
`

const drizzleDemoComponent = `<script lang="ts" setup>
const { data: users } = useFetch('/api/users')
</script>
<template>
  ${generateModuleHTMLComponent(
    "Drizzle ORM",
    "If you know SQL, you know Drizzle ORM: Drizzle ORM follows the SQL-like syntax whenever possible, are strongly typed ground up, and fail at compile time, not in runtime.",
    "https://orm.drizzle.team/",
    `<p>
        Drizzle ORM Data from the database, received {{ users?.length || 0 }} records!
      </p>`,
    "",
  ).html}
</template>
`

const drizzle: ModuleConfig = {
  humanReadableName: "Drizzle ORM",
  description: "TypeScript ORM that feels like writing SQL. See more: https://orm.drizzle.team/",
  dependencies: [
    {
      name: "drizzle-orm",
      version: "^0.28.6",
      isDev: false
    },
    {
      name: "drizzle-kit",
      version: "^0.19.13",
      isDev: true
    },
    {
      name: "better-sqlite3",
      version: "^9.0.0",
      isDev: false
    },
    {
      name: "@types/better-sqlite3",
      version: "^7.6.5",
      isDev: true
    },
  ],
  nuxtConfig: {},
  files: [{
    path: "drizzle.config.ts",
    content: drizzleConfig
  }, {
    path: "db/schema.ts",
    content: drizzleSchema
  }, {
    path: "server/api/sqlite-service.ts",
    content: drizzleService
  }, {
    path: "server/api/users.get.ts",
    content: drizzleAPIGet
  }, {
    path: "components/Welcome/DrizzleDemo.vue",
    content: drizzleDemoComponent,
  }],
  tasksPostInstall: [
    "- [ ] Drizzle: Edit your `db/schema.ts` to your liking",
    "- [ ] Drizzle: Run `npx drizzle-kit push:sqlite` to sync the schema to your database",
    "- [ ] Drizzle: Run `npx drizzle-kit studio` to use the built-in Drizzle Database explorer",
  ],
  indexVue: generateModuleHTMLSnippet("WelcomeDrizzleDemo"),
}

export default drizzle
