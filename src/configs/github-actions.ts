import type { Config } from '../types'

const GITHUB_ACTIONS_TEMPLATE = `
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js 20.6.1
        uses: actions/setup-node@v4
        with:
          node-version: 20.6.1

      - name: Setup
        run: npm i -g @antfu/ni

      - name: Install
        run: nci

      - name: Lint
        run: nr lint

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js 20.6.1
        uses: actions/setup-node@v4
        with:
          node-version: 20.6.1

      - name: Setup
        run: npm i -g @antfu/ni

      - name: Install
        run: nci

      - name: Build
        run: nr build

  # TODO: Add more steps here, like "nr test" as you add the tooling for it
`

const githubActions: Config = {
  scripts: [],
  dependencies: [],
  nuxtConfig: {},
  files: [
    {
      path: '.github/workflows/ci.yaml',
      content: GITHUB_ACTIONS_TEMPLATE
    }
  ],
}

export default githubActions
