<template>
  <div class="flex items-stretch flex-col min-h-[100vh]">
    <main class="grow flex items-justify">
      <slot />
    </main>
  </div>
</template>

<script lang="ts" setup>
useHead({
  title: "WassupChat: Chat",
  meta: [
    {
      rel: "icon",
      href: "/chat.svg",
      type: "image/svg",
    },
  ],
})
</script>

<style></style>
