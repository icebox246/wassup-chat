<template>
  <UContainer class="flex flex-col items-center">
    <h1 class="text-5xl">WassupChat</h1>
    <h2 class="p-7">Chat with everyone</h2>
    <div class="grid grid-cols-2 gap-3">
      <UButton @click="handleRegister" icon="i-mdi-add"> Sign up </UButton>
      <UButton @click="handleLogin" icon="i-mdi-login" variant="outline"> Sign in </UButton>
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
function handleRegister() {
  navigateTo("/register");
}

function handleLogin() {
  navigateTo("/login");
}
</script>

<style></style>
