import fetch from "node-fetch"
import { cliOptions } from "./parseCliOptions"

// Adapted from: https://github.com/withastro/astro/blob/2552816d5fa14a191a73179698b4b6f574a9963f/packages/create-astro/src/messages.ts#L44-L58
let v: string
export const getVersion = async () => {
  if (v) {
    return v
  }

  if (process.env.NODE_ENV != "development" && !cliOptions.nocounting) {
    try {
      fetch("https://plausible.io/api/event", {
        method: "POST",
        headers: { "User-Agent": "Mozilla/5.0", "X-Forwarded-For": `2.175.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` },
        body: "{\"name\":\"cli\",\"url\":\"https://cli.sidebase.io/\",\"domain\":\"cli.sidebase.io\"}"
      })
    } catch (error) {
      // pass
    }
  }

  let response: { version: string }
  try {
    response = await fetch("https://registry.npmjs.org/create-sidebase/latest").then(response => response.json() as unknown as { version: string } )
  } catch (error) {
    response = { version: "0.0.0" }
  }

  v = response.version
  return v
}
