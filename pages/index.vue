<template>
  <UContainer class="flex flex-col items-center">
    <h1 class="text-5xl">WassupChat</h1>
    <h2 class="p-7">Chat with everyone</h2>
    <div v-if="!(store.loggedIn && store.currentUser)">
      <div class="grid grid-cols-2 gap-3">
        <UButton @click="handleRegister" icon="i-mdi-add" size="lg"> Sign up </UButton>
        <UButton @click="handleLogin" icon="i-mdi-login" size="lg" variant="outline"> Sign in </UButton>
      </div>
    </div>
    <div v-else class="grid-cols-1">
      <UButton @click="handleApp" icon="i-mdi-chat-processing" size="xl"> Open app </UButton>
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
const store = useMyAppStore()

function handleRegister() {
  navigateTo("/register");
}

function handleLogin() {
  navigateTo("/login");
}

function handleApp() {
  navigateTo("/app")
}
</script>

<style></style>
