<template>
  <div class="flex self-stretch items-stretch grow">
    <ChannelList />
    <ChatMessages />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'app'
})

const store = useMyAppStore()
const params = useUrlSearchParams('history', { removeFalsyValues: true });

watch(() => store.currentChannelId, (newId) => {
  if (newId === null || newId === undefined) {
    params.channelId = [];
  } else {
    params.channelId = newId.toString();
  }
})

onMounted(() => {
  store.currentChannelId = params.channelId ? Number.parseInt(params.channelId.toString()) : null
})

</script>

<style></style>
