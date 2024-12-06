<template>
  <UPopover v-if="store.loggedIn && store.currentUser" :popper="{ arrow: true }">
    <UButton square size="md" variant="link">
      <template #leading>
        <UAvatar :src="avatarUrl" size="md" />
      </template>
      <p class="pr-3"> {{ store.currentUser.username }} </p>
    </UButton>

    <template #panel>
      <div class="p-4">
        <UButton @click="handleLogout" icon="i-mdi-logout">
          Logout
        </UButton>
      </div>
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
