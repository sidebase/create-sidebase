import type { Config } from '../types'

const DRONE_TEMPLATE = `kind: pipeline
type: kubernetes
name: CI

trigger:
  event:
    - pull_request

steps:
  - name: lint-and-typecheck
    image: node:20.9.0-slim
    commands:
      - npm i -g @antfu/ni
      - nci
      - nr lint
      - nr typecheck
  - name: build
    image: node:20.9.0-slim
    commands:
      - npm i -g @antfu/ni
      - nci
      - nr build
`

const droneCI: Config = {
  scripts: [],
  dependencies: [],
  nuxtConfig: {},
  files: [{
    path: '.drone.yml',
    content: DRONE_TEMPLATE
  }],
}

export default droneCI
