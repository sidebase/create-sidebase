import { execa } from 'execa'
import { getUserPkgManager } from '../utils/getUserPkgManager'

export default (templateDir: string) => execa(getUserPkgManager(), ['install'], { cwd: templateDir, env: { NODE_ENV: 'development' } })
