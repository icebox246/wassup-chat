import { defineStore } from 'pinia'

export const useMyAppStore = defineStore(
  'myAppStore',
  () => {
    const { data: currentUser, refresh: fetchCurrentUser } = useFetch('/api/me');
    const loggedIn = computed(() => {
      return currentUser && !currentUser.value?.err
    })

    return { currentUser, fetchCurrentUser, loggedIn }
  },
)
