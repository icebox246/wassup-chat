<template>
  <UBadge color="gray" v-if="profile" class="px-3">
    <UAvatar :src="'https://robohash.org/foobar' + (profile as any).username" size="md" />
    {{ (profile as any).username }}
  </UBadge>
</template>

<script lang="ts" setup>
const { data: profile, refresh } = useFetch('/api/me');
const authCookie = useCookie('auth-cookie')

effect(() => {
  authCookie.value;
  refresh()
})
</script>

<style></style>
