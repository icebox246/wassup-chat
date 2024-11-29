import { defineStore } from 'pinia'

export const useMyAppStore = defineStore(
  'myAppStore',
  () => {
    const { data: currentUser, refresh: fetchCurrentUser } = useFetch('/api/me');

    return { currentUser, fetchCurrentUser }
  },
)
