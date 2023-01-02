import fetch from "node-fetch"
import { Preferences } from "../prompts"
import { cliOptions } from "./parseCliOptions"

/**
 * This method provides basic usage tracking. Note:
 * - we use plausible as a privacy friendly tracker,
 * - we only track: a) invocation count, b) what stack was selected, c) what modules were selected
 *
 * No identifiably information (such as project name, IP, user-agent) is transmitted in the process. You can opt out by passing `--nocounting` to the CLI on invocation.
 */
let alreadyCounted = false
export const count = async (preferences: Preferences) => {
  if (alreadyCounted || process.env.NODE_ENV === "development" || cliOptions.nocounting) {
    return
  }

  // We do not want to know identifiable information, only pass: Stack + selected modules
  const annonymizedPreferences = new URLSearchParams({ ref: preferences.setStack, utm_content: (preferences.addModules || []).join(",") || "null" })
  const headers = { "User-Agent": "Mozilla/5.0", "X-Forwarded-For": `2.175.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` }
  return fetch("https://plausible.io/api/event", {
    method: "POST",
    headers,
    body: `{"name":"cli","url":"https://cli.sidebase.io/?${annonymizedPreferences}","domain":"cli.sidebase.io"}`
  }).then(() => { alreadyCounted = true }).catch(() => { return })
}
