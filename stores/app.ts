import type { Message, User } from '@prisma/client';
import { defineStore } from 'pinia'

export const useMyAppStore = defineStore(
  'myAppStore',
  () => {
    const { data: currentUser, error: userError, refresh: fetchCurrentUser } = useFetch('/api/me');
    const loggedIn = computed(() => {
      console.log(currentUser)
      return currentUser.value?.me
    })
    const { data: subscribedChannels, refresh: fetchSubscribedChannels } = useFetch('/api/channel/subscribed')
    const currentChannel = ref<{
      id: number;
      name: string;
      topic: string | null;
      adminId: number;
      createdDate: string;
    } | null>()

    const currentChannelId = ref<number | null>()

    const webSocketSendFunctor = ref<((data: string) => boolean) | null>(null)

    const { data: currentMessagesData, refresh: refreshMessages, clear: clearMessages } = useLazyFetch(() => `/api/channel/${currentChannelId.value}/messages`);

    const currentMessages = ref<Array<Message & { author: User }>>()

    watch(currentChannelId, async (newVal) => {
      currentChannel.value = subscribedChannels.value?.channels?.find(c => c.id == currentChannelId.value)
      if (newVal !== null) {
        setTimeout(() => refreshMessages(), 10)
      } else {
        setTimeout(() => currentMessages.value = new Array(), 10)
      }
    })

    watch(currentMessagesData, (newData) => {
      if (newData?.err || !newData?.messages) return;
      currentMessages.value = newData?.messages.map(m => {
        return {
          ...m,
          sentDate: new Date(m.sentDate),
          author: { ...m.author, registeredDate: new Date(m.author.registeredDate) }
        }
      });
    })

    async function fetchCurrentMessages() {
      clearMessages()
      await refreshMessages()
    }

    const sendMessage = async (content: string, type: string) => {
      if (!content || content === '') {
        throw Error("Empty message");
        return;
      }

      if (webSocketSendFunctor.value && currentChannelId.value) {
        const msg: PostMessageSocketMessage = {
          type: SocketMesageType.post_message,
          message: {
            content, type, channel_id: currentChannelId.value
          }
        }
        webSocketSendFunctor.value(JSON.stringify(msg))
      }
    }

    const deleteMessage = async (id: number) => {
      if (webSocketSendFunctor.value) {
        const msg: DeleteMessageSocketMessage = {
          type: SocketMesageType.delete_message,
          messageId: id
        }
        webSocketSendFunctor.value(JSON.stringify(msg))
      }
    }

    return {
      currentUser,
      fetchCurrentUser,
      loggedIn,
      subscribedChannels,
      fetchSubscribedChannels,
      currentMessages,
      fetchCurrentMessages,
      sendMessage,
      deleteMessage,
      currentChannelId,
      currentChannel,
      webSocketSendFunctor
    }
  },
)
