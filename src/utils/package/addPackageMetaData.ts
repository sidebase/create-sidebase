import { resolve } from 'node:path'
import { readPackageJSON, writePackageJSON } from 'pkg-types'
import type { PackageManager } from '../getUserPkgManager'
import { getUserPkgManager } from '../getUserPkgManager'

const NODE_VERSION = '>=18.0.0'
const PKG_MANAGER_VERSIONS: Partial<Record<PackageManager, string>> = {
  pnpm: 'pnpm@9.11.0',
  yarn: 'yarn@3.2.3'
}

export async function addPackageMetaData(opts: { name: string, projectDir: string }) {
  const { projectDir, name } = opts

  const pathToPackageJson = resolve(`./${projectDir}/package.json`)
  const packageJson = await readPackageJSON(pathToPackageJson)

  // Set package meta data
  packageJson.name = name
  packageJson.engines = { node: NODE_VERSION }

  // Set package manager
  const packageManager = getUserPkgManager()
  const packageManagerVersion = PKG_MANAGER_VERSIONS[packageManager]
  if (packageManagerVersion) {
    packageJson.packageManager = packageManagerVersion
  }

  await writePackageJSON(pathToPackageJson, packageJson)
}
