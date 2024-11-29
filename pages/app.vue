<template>
  <UContainer class="flex self-stretch items-stretch grow">
    <ChannelList />
    <h1>Here lives Chat</h1>
  </UContainer>
</template>

<script lang="ts" setup>

definePageMeta({
  middleware: [
    (to, from) => {
      const store = useMyAppStore()

      if (!store.loggedIn) {
        return navigateTo('/');
      }
    }
  ]
})
</script>

<style></style>
