<template>
  <UPopover v-if="store.loggedIn && store.currentUser" mode="hover">
    <UButton square size="md" variant="link">
      <template #leading>
        <UAvatar :src="avatarUrl" size="md" />
      </template>
      <p class="pr-3"> {{ store.currentUser?.me?.username }} </p>
    </UButton>

    <template #panel>
      <div class="grid gap-2 grid-cols-1 p-4">
        <UButton @click="copyInviteCode" color="primary" icon="i-mdi-account-multiple-plus-outline">
          Add friend
        </UButton>
        <UButton @click="handleLogout" icon="i-mdi-logout" variant="outline">
          Logout
        </UButton>
      </div>
    </template>
  </UPopover>
</template>

<script lang="ts" setup>
const store = useMyAppStore()

const toast = useToast()

const avatarUrl = computed(() => `https://robohash.org/${store.currentUser?.me?.username}`)
const inviteLink = ref<string | null>(null);
const inviteCode = computed(() => store.currentUser?.me?.inviteCode || 'error');

async function copyInviteCode() {
  try {
    await navigator.clipboard.writeText(inviteCode.value);
    alert('Invite Code copied!');
  } catch (err) {
    console.error('Failed to copy invite code:', err);
    alert('Failed to copy invite code.');
  }
}

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
