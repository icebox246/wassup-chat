<template>
  <UPopover v-if="store.loggedIn && store.currentUser">
    <UButton color="gray" class="px-3">
      <UAvatar :src="avatarUrl" size="md" />
      {{ store.currentUser.username }}
    </UButton>
    <template #panel>
      <UCard>
        <UButton @click="handleLogout" icon="i-mdi-logout">
          Logout
        </UButton>
      </UCard>
    </template>
  </UPopover>
</template>

<script lang="ts" setup>
const store = useMyAppStore()

const toast = useToast()

const avatarUrl = computed(() => `https://robohash.org/${store.currentUser?.username}`)

async function handleLogout() {
  await $fetch("/api/logout")
  toast.add({
    icon: "i-mdi-logout", title: "Logged out", timeout: 1000
  })
  store.fetchCurrentUser()
  navigateTo("/")
}
</script>

<style></style>
