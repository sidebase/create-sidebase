import { join } from "path"

export const getResolver = (templateDir: string) => (path: string) => join(templateDir, path)
