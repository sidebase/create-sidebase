#!/bin/env node
import { say, sayWelcome } from "./messages"

const sleep = (duration: number) => new Promise(r => setTimeout(r, duration))

const main = async () => {
  sayWelcome()

  await sleep(500)

  say("sidebase helps you to create fully typesafe Nuxt 3 app in seconds: https://sidebase.io/sidebase\n")

  await sleep(1000)

  say("Let's get started!")
}

main().catch((err) => {
  console.error("Aborting installation...")
  if (err instanceof Error) {
    console.error(err)
  } else {
    console.error(
      "An unknown error has occurred. Please open an issue on github with the below:",
    )
    console.log(err)
  }
  process.exit(1)
})
