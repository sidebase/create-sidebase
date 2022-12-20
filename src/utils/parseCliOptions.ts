import { program } from "commander"

program.option("--quick", "Quicker flow by skipping most of Diamonds interactions", false)
program.option("--ci", "Set CI mode: Selects the merino stack and all options, non-interactive", false)
program.option("--nocounting", "Only one datapoint is collected: 'An invocation happened'. No further data or meta-data is collected. Opt out of this by setting this flag.", false)
program.parse()

export const cliOptions: { quick: boolean, nocounting: boolean, ci: boolean } = program.opts()
