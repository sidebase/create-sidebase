import { mkdir, writeFile } from "node:fs/promises"
import { getResolver } from "../getResolver"
import { Preferences } from "../prompts"

const GITHUB_ACTIONS_TEMPLATE = `
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:

    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Use Node.js 16.14.2
        uses: actions/setup-node@v3
        with:
          node-version: 16.14.2

      - run: npm ci

      - run: npm run build

      # TODO: Add more steps here, like "npm run lint" or "npm run test" as you add the tooling for it
`

export default async (preferences: Preferences, templateDir: string) => {
  // Cheviot already has github actions by default
  if (preferences.setStack === "cheviot") {
    return
  }

  const resolver = getResolver(templateDir)

  await mkdir(resolver(".github/workflows"), { recursive: true })
  await writeFile(resolver(".github/workflows/ci.yaml"), GITHUB_ACTIONS_TEMPLATE)
}
