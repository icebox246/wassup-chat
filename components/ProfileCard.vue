<template>
  <UBadge color="gray" v-if="profile" class="px-3">
    <UAvatar :src="avatarUrl" size="md" />
    {{ profile.username }}
  </UBadge>
</template>

<script lang="ts" setup>
const { data: profile, refresh } = useFetch('/api/me');
const authCookie = useCookie('auth-cookie')

const avatarUrl = computed(() => `https://robohash.org/${profile.value?.username}`)

effect(() => {
  authCookie.value;
  refresh()
})
</script>

<style></style>
