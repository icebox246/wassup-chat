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
    const currentChannelId = ref<Number | null>(null)
    const { data: currentMessages, refresh: refreshMessages, clear: clearMessages } = useLazyFetch(() => `/api/channel/${currentChannelId.value}/messages`);

    async function fetchCurrentMessages() {
      clearMessages()
      await refreshMessages()
    }

    const sendMessage = (content: string, type: string) => {
      if (!content || content === '') {
        throw Error("Empty message");
        return;
      }
      $fetch(`/api/channel/${currentChannelId?.value}/messages`, {
        method: "POST",
        body: {
          content, type
        }
      })
      refreshMessages()
    }


    return { currentUser, fetchCurrentUser, loggedIn, subscribedChannels, fetchSubscribedChannels, currentChannelId, currentMessages, fetchCurrentMessages, sendMessage, }
  },
)
