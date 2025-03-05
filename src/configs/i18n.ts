import { generateModuleHTMLComponent, generateModuleHTMLSnippet } from '../generators/generateModuleComponents'
import type { ModuleConfig } from '../types'

const localeDetector = `// Detect language to enable server side translations https://i18n.nuxtjs.org/docs/guide/server-side-translations
export default defineI18nLocaleDetector((event, config) => {
  // try to get locale from query
  const query = tryQueryLocale(event, { lang: '' })
  if (query) {
    return query.toString()
  }

  // try to get locale from cookie
  const cookie = tryCookieLocale(event, { lang: '', name: 'i18n_locale' })
  if (cookie) {
    return cookie.toString()
  }

  // try to get locale from header accept-header
  const header = tryHeaderLocale(event, { lang: '' })
  if (header) {
    return header.toString()
  }

  // fallback to default locale
  return config.defaultLocale
})
`

const englishLocaleFile = `{
    "title": "Nuxt i18n",
    "description": "I18n (Internationalization) module for your Nuxt project powered by Vue I18n."
}
`

const i18nDemoComponent = `<template>
  ${generateModuleHTMLComponent(
    `{{ $t('title') }}`,
    `{{ $t('description') }}`,
    'https://i18n.nuxtjs.org/',
    '',
    '',
  ).html}
</template>
`

const i18n: ModuleConfig = {
  humanReadableName: 'i18n',
  description: 'I18n (Internationalization) module for your Nuxt project powered by Vue I18n. See more: https://i18n.nuxtjs.org/',
  scripts: [],
  dependencies: [
    {
      name: '@nuxtjs/i18n',
      version: '^9.2.1',
      isDev: true
    }
  ],
  nuxtConfig: {
    modules: ['@nuxtjs/i18n'],
    // @ts-expect-error i18n is not set in default Nuxt Config, as the package is not installed
    i18n: {
      defaultLocale: 'en',
      locales: [
        { name: 'English', code: 'en', file: 'en.json' },
      ],
      strategy: 'prefix_except_default',
      detectBrowserLanguage: false,
      lazy: true,
      experimental: {
        autoImportTranslationFunctions: true,
        localeDetector: 'localeDetector.ts'
      }
    }
  },
  files: [
    {
      path: 'i18n/localeDetector.ts',
      content: localeDetector
    },
    {
      path: 'i18n/locales/en.json',
      content: englishLocaleFile
    },
    {
      path: 'components/Welcome/I18nDemo.vue',
      content: i18nDemoComponent
    }
  ],
  tasksPostInstall: [],
  indexVue: generateModuleHTMLSnippet('WelcomeI18nDemo'),
}

export default i18n
