import { resolve } from 'node:path'
import { readPackageJSON, writePackageJSON } from 'pkg-types'
import { defu } from 'defu'
import type { Dependency } from '../../types'

export async function addPackageDependencies(opts: {
  dependencies: Dependency[]
  projectDir: string
}) {
  const { projectDir, dependencies } = opts

  const pathToPackageJson = resolve(`./${projectDir}/package.json`)
  const packageJson = await readPackageJSON(pathToPackageJson)

  for (const { name, version, isDev, isPeer } of dependencies) {
    if (isDev) {
      packageJson.devDependencies = defu(packageJson.devDependencies, {
        [name]: version
      })
    }
    else if (isPeer) {
      packageJson.peerDependencies = defu(packageJson.peerDependencies, {
        [name]: version
      })
    }
    else {
      packageJson.dependencies = defu(packageJson.dependencies, {
        [name]: version
      })
    }
  }

  await writePackageJSON(pathToPackageJson, packageJson)
}
