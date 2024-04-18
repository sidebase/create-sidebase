import ora from 'ora'

export async function wrapInSpinner<T extends (...a: any) => any>(text: string, func: T, ...args: any[]) {
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
