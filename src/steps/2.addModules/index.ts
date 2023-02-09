import { getResolver } from "../../getResolver"
import { Preferences  } from "../../prompts"
import { File, moduleConfigs, Modules } from "./moduleConfigs"
import { addPackageDependencies, Dependency } from "../../utils/addPackageDependency"
import { writeFile, mkdir } from "node:fs/promises"
import path from "node:path"
import { NuxtConfig } from "@nuxt/schema"
import defu from "defu"
import { inspect } from "node:util"

export default async (preferences: Preferences, templateDir: string) => {
  const selectedModules: Modules[] = preferences.addModules || []
  const resolver = getResolver(templateDir)

  // 1. Gather module configuration for all selected modules
  let dependencies: Dependency[] = []
  let nuxtConfigExtensions: NuxtConfig[] = []
  let files: File[] = []

  for (const selectedModule of selectedModules) {
    dependencies = [...dependencies, ...moduleConfigs[selectedModule].dependencies]
    nuxtConfigExtensions = nuxtConfigExtensions.concat(moduleConfigs[selectedModule].nuxtConfig)
    files = files.concat(moduleConfigs[selectedModule].files)
  }

  // 2. Add required dependencies to `package.json`
  addPackageDependencies({
    projectDir: preferences.setProjectName,
    dependencies
  })

  // 3. Add extra files for modules that need it
  for (const file of files) {
    const folder = path.dirname(file.path)
    await mkdir(resolver(folder), { recursive: true })
    await writeFile(resolver(file.path), file.content)
  }

  // 4. Write nuxt config
  let nuxtConfig = {
    typescript: {
      shim: false
    }
  }
  for (const nuxtConfigExtension of nuxtConfigExtensions) {
    nuxtConfig = defu(nuxtConfig, nuxtConfigExtension)
  }
  const nuxtConfigFile = `// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig(${inspect(nuxtConfig, { compact: false })})
`
  await writeFile(resolver("nuxt.config.ts"), nuxtConfigFile)

  // 5. Write app.vue to ensure that sub-example-pages of different modules will work
  const nuxtAppVue = `<template>
  <div>
    <NuxtPage />
  </div>
</template>
`
  await writeFile(resolver("app.vue"), nuxtAppVue)

  // 6. Write index.vue with a nice welcome message as well as links to sub-pages
  const moduleIndexHtmlSnippets = selectedModules.map((module) => moduleConfigs[module].htmlForIndexVue).filter(html => typeof html !== "undefined")
  const moduleIndexHtml = moduleIndexHtmlSnippets.length > 0 ? "\n    " + moduleIndexHtmlSnippets.join("\n    ") : ""

  const moduleIndexCSSSnippets = selectedModules.map((module) => moduleConfigs[module].cssForIndexVue).filter(html => typeof html !== "undefined")
  const moduleIndexCSS = moduleIndexHtmlSnippets.length > 0 ? "\n    " + moduleIndexCSSSnippets.join("\n    ") : ""


  const nuxtPagesIndexVue = `<template>
    <div class="main-container">
        <div class="heading">
            <h1 class="heading__title">Welcome to your new <span class="gradient__text">sidebase</span> app!</h1>
            <p class="heading__credits">
                Read our documentation <a href="https://sidebase.io/sidebase/welcome" target="_blank">here</a>. Get started in no time with the following amazing modules:
            </p>
        </div>
        <div class="cards">
            ${moduleIndexHtml}
        </div>
    </div>
  </template>
  <style>
      * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
      }

      body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
          Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
          background-color: #eefbfc;
          color: #484848;
      }

      .main-container {
          max-width: 45vw;
          margin: auto;
          padding-top: 100px;
      }

      /* HEADING */

      .heading {
          text-align: center;
      }

      .heading__title {
          font-weight: 600;
          font-size: 40px;
      }

      .gradient__text {
          background: linear-gradient(to right, #7bceb6 10%, #12a87b 40%, #0FCF97 60%, #7bceb6 90%);
          background-size: 200% auto;
          color: #000;
          background-clip: text;
          text-fill-color: transparent;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 1s linear infinite;
      }

      @keyframes shine {
          to {
              background-position: 200% center;
          }
      }

      .heading__credits {
          color: #888888;
          font-size: 25px;
          transition: all 0.5s;
      }

      .heading__credits a {
        text-decoration: underline;
      }

      /* CARDS */

      .cards {
          display: grid;
          gap: 20px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          margin-top: 30px;
      }

      .card {
          padding: 20px;
          width: 100%;
          min-height: 200px;
          display: grid;
          grid-template-rows: 20px 50px 1fr 50px;
          border-radius: 10px;
          box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.25);
          transition: all 0.2s;
      }

      .card:hover {
          box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.4);
          transform: scale(1.01);
      }

      .card__link {
          position: relative;
          text-decoration: none;
          color: rgba(255, 255, 255, 0.9);
      }

      .card__link::after {
          position: absolute;
          top: 25px;
          left: 0;
          content: "";
          width: 0%;
          height: 3px;
          background-color: rgba(255, 255, 255, 0.6);
          transition: all 0.5s;
      }

      .card__link:hover::after {
          width: 100%;
      }

      .card__title {
          font-weight: 400;
          color: #ffffff;
          font-size: 30px;
      }

      .card__body {
          grid-row: 2/4;
      }

      .card__body p {
          color: #ffffff;
      }

      .card__action {
          grid-row: 5/6;
          align-self: center;
          display: flex;
          gap: 20px
      }

      /* RESPONSIVE */

      @media (max-width: 1600px) {
          .main-container {
              max-width: 100vw;
              padding: 50px;
          }

          .cards {
              justify-content: center;
              grid-template-columns: repeat(1, minmax(0, 1fr));
          }
      }

      /* CARD BACKGROUNDS */

      ${moduleIndexCSS}
    </style>
`
  await mkdir(resolver("pages"), { recursive: true })
  await writeFile(resolver("pages/index.vue"), nuxtPagesIndexVue)
}
