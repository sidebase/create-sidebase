import type { Script } from '../../types'
import { resolve } from 'node:path'
import { defu } from 'defu'
import { readPackageJSON, writePackageJSON } from 'pkg-types'

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
