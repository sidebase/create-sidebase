import { program } from "commander"

program.option("--quick", "Quicker flow by skipping most of Diamonds interactions", false)
program.parse()

export const cliOptions: { quick: boolean } = program.opts()
