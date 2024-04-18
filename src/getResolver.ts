import { join } from 'node:path'

export const getResolver = (templateDir: string) => (path: string) => join(templateDir, path)
