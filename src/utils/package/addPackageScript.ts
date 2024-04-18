import { resolve } from 'node:path'
import { readPackageJSON, writePackageJSON } from 'pkg-types'
import { defu } from 'defu'
import type { Script } from '../../types'

export async function addPackageScripts(opts: {
  scripts: Script[]
  projectDir: string
}) {
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
