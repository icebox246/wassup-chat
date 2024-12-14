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
    const params = useUrlSearchParams('history', { removeFalsyValues: true });
    const currentChannel = ref<{
      id: number;
      name: string;
      topic: string | null;
      adminId: number;
      createdDate: string;
    } | null>()

    const currentChannelId = ref<number | null>(params.channelId ? Number.parseInt(params.channelId.toString()) : null)

    const { data: currentMessages, refresh: refreshMessages, clear: clearMessages } = useLazyFetch(() => `/api/channel/${currentChannelId.value}/messages`);

    watch(currentChannelId, async (newId, oldId) => {
      console.log("currentChannelId:", newId, oldId)

      currentChannel.value = subscribedChannels.value?.channels?.find(c => c.id == currentChannelId.value)
      await refreshMessages()

      if (newId === null) {
        params.channelId = [];
      } else {
        params.channelId = newId.toString();
      }
    })

    async function fetchCurrentMessages() {
      clearMessages()
      await refreshMessages()
    }

    const sendMessage = (content: string, type: string) => {
      if (!content || content === '') {
        throw Error("Empty message");
        return;
      }
      $fetch(`/api/channel/${currentChannelId.value}/messages`, {
        method: "POST",
        body: {
          content, type
        }
      })
      refreshMessages()
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
