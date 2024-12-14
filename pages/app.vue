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

const { status: wsStatus, data: wsData, send: wsSend } = useWebSocket("/api/channel/ws", {
  heartbeat: {
    message: JSON.stringify({ type: SocketMesageType.ping }),
    interval: 1000,
    pongTimeout: 1000,
  },
  autoReconnect: true
})

watch(wsStatus, (newStat) => {
  console.log("Got new websocket status: ", newStat)
})

const toast = useToast()

watch(wsData, (newVal) => {
  const data = JSON.parse(newVal);
  console.log("Got data!")
  if (!isSocketMessage(data)) {
    return
  }
  if (isNewMessageMessage(data)) {
    console.log("Got new message", data.message)
    if (data.message.channelId === store.currentChannelId) {
      store.currentMessages?.push(data.message)
    } else {
      // TODO: show notification using system notifications
      toast.add({
        title: `${data.message.author.username} @ ${data.message.channelId}`,
        description: data.message.content,
        timeout: 3000,
        avatar: { src: `https://robohash.org/${data.message.author.username}` }
      })
    }
  }
  console.log("Got on websocket: ", data)
})

onMounted(() => {
  store.currentChannelId = params.channelId ? Number.parseInt(params.channelId.toString()) : null
  store.webSocketSendFunctor = wsSend
})

</script>

<style></style>
