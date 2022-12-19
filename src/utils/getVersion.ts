import fetch from "node-fetch"
import crypto from "crypto"
import { cliOptions } from "./parseCliOptions"

// Adapted from: https://github.com/withastro/astro/blob/2552816d5fa14a191a73179698b4b6f574a9963f/packages/create-astro/src/messages.ts#L44-L58
let v: string
export const getVersion = async () => {
  if (v) {
    return v
  }

  if (!cliOptions.nocounting) {
    fetch("https://plausible.io/api/event", {
      method: "POST",
      headers: { "User-Agent": "Mozilla/5.0", "X-Forwarded-For": "127.0.0.1" },
      body: `{"name":"cli","url":"https://sidebase.io/sidebase-cli/${crypto.randomBytes(16).toString("hex")}","domain":"sidebase.io"}`
    })
  }

  const response: { version: string } = await fetch("https://registry.npmjs.org/create-sidebase/latest").then(response => response.json() as unknown as { version: string } )

  v = response.version
  return response.version
}
