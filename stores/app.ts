import { defineStore } from 'pinia'

export const useMyAppStore = defineStore(
  'myAppStore',
  () => {
    const { data: currentUser, error: userError, refresh: fetchCurrentUser } = useFetch('/api/me');
    const loggedIn = computed(() => {
      console.log(currentUser)
      return currentUser.value && !userError.value
    })
    const { data: subscribedChannels, refresh: fetchSubscribedChannels } = useFetch('/api/subscribedChannels')
    const currentChannelId = ref<null | number>()

    return { currentUser, fetchCurrentUser, loggedIn, subscribedChannels, fetchSubscribedChannels, currentChannelId }
  },
)
