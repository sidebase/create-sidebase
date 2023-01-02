import { program } from "commander"

program.option("--quick", "Quicker flow by skipping most of Diamonds interactions", false)
program.option("--ci", "Set CI mode: Selects the merino stack and all options, non-interactive", false)
program.option("--nocounting", "Only the following annonymous data is collected: a) an invocation happened, b) what stack was selected?, c) what modules were selected?. No further identifiable or unidentifiable data or meta-data (such as project name, ...) is collected. Opt out of this by setting this flag.", false)
program.parse()

export const cliOptions: { quick: boolean, nocounting: boolean, ci: boolean } = program.opts()
