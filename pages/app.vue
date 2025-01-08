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

const { status: wsStatus, data: wsData, send: wsSend, close: wsClose, open: wsOpen } = useWebSocket("/api/channel/ws", {
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
    data.message.sentDate = new Date(data.message.sentDate);
    if (data.message.channelId === store.currentChannelId) {
      store.currentMessages?.push(data.message)
    } else {
      const title = `${data.message.author.username} @ ${store.subscribedChannels?.channels?.find(c => c.id == data.message.channelId)?.name}`;
      const body = data.message.type == "text" ? data.message.content : "Sent an attachment";
      const icon = `https://robohash.org/${data.message.author.username}`
      if (isSystemNofiticationsAllowed()) {
        showNotification(title, body, icon)
      } else {
        toast.add({
          title,
          description: body,
          timeout: 3000,
          avatar: { src: icon }
        })
      }
    }
  }
  if (isDeleteMessageMessage(data)) {
    console.log("Should delete message", data.messageId)
    store.currentMessages = store.currentMessages?.filter(msg => msg.id !== data.messageId)
  }
  console.log("Got on websocket: ", data)
})

onMounted(async () => {
  await store.fetchSubscribedChannels()

  if (params.channelId) {
    const parsedId = Number.parseInt(params.channelId.toString())
    store.currentChannelId = isNaN(parsedId) ? null : parsedId
  } else if (store.subscribedChannels?.channels?.length > 0) {
    store.currentChannelId = store.subscribedChannels.channels[0].id
  } else {
    store.currentChannelId = null
  }

  store.webSocketSendFunctor = wsSend
  store.webSocketReconnectFunctor = () => {
    wsClose()
    wsOpen()
  }
  requestNotificationPermission()
})
</script>

<style></style>
