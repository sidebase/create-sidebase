import { resolve } from "node:path"
import { readPackageJSON, writePackageJSON } from "pkg-types"
import { defu } from "defu"

export interface Dependency {
  name: string
  version: string
  isDev: boolean
}

export const addPackageDependencies = async (opts: {
  dependencies: Dependency[];
  projectDir: string;
}) => {
  const { projectDir, dependencies } = opts

  const pathToPackageJson = resolve(`./${projectDir}/package.json`)
  const packageJson = await readPackageJSON(pathToPackageJson)

  for (const { name, version, isDev } of dependencies) {
    if (isDev) {
      packageJson.devDependencies = defu(packageJson.devDependencies, {
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
