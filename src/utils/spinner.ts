import ora from "ora"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const wrapInSpinner = async <T extends (...a: any) => any>(text: string, func: T, ...args: any[]) => {
  const spinner = ora(text).start()

  const result = await func(...args)

  spinner.succeed()

  return result as Awaited<ReturnType<T>>
}
