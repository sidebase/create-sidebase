import fetch from 'node-fetch'

// Adapted from: https://github.com/withastro/astro/blob/2552816d5fa14a191a73179698b4b6f574a9963f/packages/create-astro/src/messages.ts#L44-L58
let v: string
export async function getVersion() {
  if (v) {
    return v
  }

  let response: { version: string }
  try {
    response = await fetch('https://registry.npmjs.org/create-sidebase/latest').then(response => response.json() as unknown as { version: string })
  }
  catch (error) {
    console.error(error)
    response = { version: '0.0.0' }
  }

  v = response.version
  return v
}
