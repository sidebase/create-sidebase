export function generateModuleHTMLComponent (
  title: string,
  description: string,
  documentationLink: string,
  demo: string,
  actions: string
): {html: string} {
  const htmlActions = actions ? `
        ${actions}` : ""

  const htmlDemo = demo ? `
      ${demo}` : ""
  const html = `<div class="layout">
    <div class="group">
      <h1 class="heading">
        ${title}
      </h1>
      <p class="description">
        ${description}
      </p>
    </div>
    <div class="group">${htmlDemo}
      <div class="actions">
        <WelcomeButtonLink href="${documentationLink}" :blank="true">
          Documentation
        </WelcomeButtonLink>${htmlActions}
      </div>
    </div>
  </div>`
  return {
    html,
  }
}

export function generateModuleHTMLSnippet (componentName: string) {
  const html = `    <div class="card">
          <${componentName} />
        </div>`
  return {
    html,
  }
}

export const buttonLink = `<script setup lang="ts">
defineProps({
  blank: {
    type: Boolean,
    required: false,
    default: false,
  },
  href: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <NuxtLink class="ButtonLink" :to="href" :target="blank ? '_blank' : undefined">
    <slot />
  </NuxtLink>
</template>

<style scoped>
.ButtonLink {
  position: relative;
  padding: 5px 15px;
  color: white;
  background-image: linear-gradient(160deg, #059669, #059669);
  border-radius: 0.3rem;
  cursor: pointer;
  user-select: none;
  transition: box-shadow 0.6s;
}
.ButtonLink:hover {
  box-shadow: 0 0 60px 2px #059669, 0.5rem 0.5rem 30px #059669;
}
.ButtonLink:after {
  content: '';
  position: absolute;
  top: 2px;
  right: 2px;
  bottom: 2px;
  left: 2px;
  border-radius: 0.75rem;
  pointer-events: none;
}
</style>
`
