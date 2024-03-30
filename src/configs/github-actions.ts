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
      - uses: actions/checkout@v3

      - name: Use Node.js 16.14.2
        uses: actions/setup-node@v3
        with:
          node-version: 16.14.2

      - name: Setup
        run: npm i -g @antfu/ni

      - name: Install
        run: nci

      - name: Lint
        run: nr lint

  build:

    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Use Node.js 16.14.2
        uses: actions/setup-node@v3
        with:
          node-version: 16.14.2

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
  files: [{
    path: '.github/workflows/ci.yaml',
    content: GITHUB_ACTIONS_TEMPLATE
  }],
}

export default githubActions
