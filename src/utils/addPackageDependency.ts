import { resolve } from "node:path"
import { readPackageJSON, writePackageJSON } from "pkg-types"
import { defu } from "defu"

export interface Dependency {
  name: string
  version: string
  isDev: boolean
  isPeer?: boolean
}

export interface Script {
  name: string,
  command: string,
}

export const addPackageDependencies = async (opts: {
  dependencies: Dependency[];
  projectDir: string;
}) => {
  const { projectDir, dependencies } = opts

  const pathToPackageJson = resolve(`./${projectDir}/package.json`)
  const packageJson = await readPackageJSON(pathToPackageJson)

  for (const { name, version, isDev, isPeer } of dependencies) {
    if (isDev) {
      packageJson.devDependencies = defu(packageJson.devDependencies, {
        [name]: version
      })
    } else if (isPeer) {
      packageJson.peerDependencies = defu(packageJson.peerDependencies, {
        [name]: version
      })
    } else {
      packageJson.dependencies = defu(packageJson.dependencies, {
        [name]: version
      })
    }
  }

  await writePackageJSON(pathToPackageJson, packageJson)
}

export const addPackageScripts = async (opts: {
  scripts: Script[];
  projectDir: string;
}) => {
  const { projectDir, scripts } = opts

  const pathToPackageJson = resolve(`./${projectDir}/package.json`)
  const packageJson = await readPackageJSON(pathToPackageJson)


  for (const { name, command } of scripts) {
    packageJson.scripts = defu(packageJson.scripts, {
      [name]: command
    })
  }

  await writePackageJSON(pathToPackageJson, packageJson)
}
