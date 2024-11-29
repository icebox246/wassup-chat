<template>
  <UBadge color="gray" v-if="store.currentUser" class="px-3">
    <UAvatar :src="avatarUrl" size="md" />
    {{ store.currentUser.username }}
  </UBadge>
</template>

<script lang="ts" setup>
const store = useMyAppStore()

const avatarUrl = computed(() => `https://robohash.org/${store.currentUser?.username}`)
</script>

<style></style>
