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

    const _currentChannelId = ref<number | null>(Number.parseInt(params.channelId ? params.channelId.toString() : ""))

    const currentChannelId = computed<number | null>({
      get: () => _currentChannelId.value,
      set: (newId) => {
        _currentChannelId.value = newId
        if (newId === null) {
          params.channelId = [];
        } else {
          params.channelId = newId.toString();
        }
      }
    })

    const { data: currentMessages, refresh: refreshMessages, clear: clearMessages } = useLazyFetch(() => `/api/channel/${currentChannelId.value}/messages`);

    watch(params, async () => {
      currentChannel.value = subscribedChannels.value?.channels?.find(c => c.id == _currentChannelId.value)
      await refreshMessages()
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
