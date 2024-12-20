<template>
  <div class="invite-view">

    <h1 class="text-5xl">Channel: {{ channel?.name }}</h1>
    <h2 v-if="channel?.topic" class="p-7">Topic: {{ channel.topic }}</h2>
    <UButton @click="joinChannel" icon="i-mdi-account-plus">Join</UButton>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const channel = ref(null);
const inviteCode = route.query.inviteCode;

async function fetchChannel() {
  try {
    const { channel: fetchedChannel } = await $fetch(`/api/channel/invite`, {
      params: { inviteCode },
    });
    channel.value = fetchedChannel;
  } catch (err) {
    toast.add({ icon: "i-mdi-alert", title: "Invalid invite code", timeout: 2000 });
  }
}

async function joinChannel() {
  try {
    await $fetch(`/api/channel/invite`, {
      method: "POST",
      body: { inviteCode },
    });
    toast.add({ icon: "i-mdi-check-bold", title: "Joined channel", timeout: 2000 });
    router.replace(`/app?channelId=${channel.value.id}`);
  } catch (err) {
    toast.add({ icon: "i-mdi-alert", title: "Failed to join channel", timeout: 2000 });
  }
}


onMounted(fetchChannel);
</script>

<style>
.invite-view {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}
</style>
