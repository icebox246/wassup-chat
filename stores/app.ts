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

    const { data: currentMessages, refresh: refreshMessages, clear: clearMessages } = useLazyFetch(() => `/api/channel/${currentChannelId.value}/messages`);

    watch(currentChannelId, async () => {
      currentChannel.value = subscribedChannels.value?.channels?.find(c => c.id == currentChannelId.value)
      setTimeout(() => refreshMessages(), 10)
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
      await $fetch(`/api/channel/${currentChannelId.value}/messages`, {
        method: "POST",
        body: {
          content, type
        }
      })
      await refreshMessages() // TODO: remove in process of adding websockets
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
      currentChannelId,
      currentChannel,
    }
  },
)
