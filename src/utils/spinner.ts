import ora from "ora"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const wrapInSpinner = async <T extends (...a: any) => any>(text: string, func: T, ...args: any[]) => {
  const spinner = ora(text).start()
  const timeoutALittleWhile = setTimeout(() => {
    spinner.text = `${text} (still running)`
  }, 10000)
  const timeoutALongWhile = setTimeout(() => {
    spinner.text = `${text} (still running... Tried counting 🐑🐑?)`
  }, 30000)

  const result = await func(...args)

  clearTimeout(timeoutALittleWhile)
  clearTimeout(timeoutALongWhile)
  spinner.succeed()

  return result as Awaited<ReturnType<T>>
}
