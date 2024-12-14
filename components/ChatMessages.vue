<template>
  <div class="flex flex-col w-full max-h-[100vh] overflow-hidden">
    <header class="flex place-content-between w-full shadow-sm">
      <h2 class="text-xl p-4" v-if="store.currentChannel">
        {{ store.currentChannel?.name }}
      </h2>
      <h2 class="flex items-center text-xl italic p-4 text-gray-600" v-else>
        <UIcon name="i-mdi-arrow-left-thin" class="w-8 h-8" color="gray-600" />
        Select a channel...
      </h2>
      <ProfileCard />
    </header>

    <!-- <main v-if="store.currentChannel" class="flex flex-col"> -->

    <div class="w-full p-4 grow overflow-y-scroll" ref="messagesView">
      <div v-for="message in store.currentMessages?.messages" :key="message.id" class="mb-2">
        <div class="flex items-start" :class="{ 'justify-end': message.authorId == store.currentUser?.me?.id }">
          <UNotification :id="Date.now()" :description="message.content"
            :avatar="{ src: `https://robohash.org/${message.author.username}` }" :title="message.author.username"
            :close-button="message.author.id === store.currentUser?.me?.id ? {
              icon: 'i-mdi-delete-outline',
              color: 'primary', variant: 'outline',
              padded: true, size: '2xs',
            } : { icon: 'none', disabled: true }"
            :timeout="new Date(message.sentDate).getTime() > loadDate.getTime() - 3000 ? 1000 : 0"
            class="max-w-md break-words whitespace-normal" />
        </div>
      </div>
    </div>

    <div class="w-full p-4">
      <div class="flex flex-row items-center w-full">
        <UInput v-model="newMessage" placeholder="Type your message" class="flex-grow m-2"
          @keyup.enter="handleSendMessage" @input="showAlert = false">
          <template #leading>
            <UAvatar :src="currentUserAvatarUrl" size="2xs" />
          </template>
        </UInput>
        <UDropdown :items="uploadItems" :popper="{ placement: 'bottom-start' }">
          <UButton class="m-2" trailing-icon="i-mdi-folder-upload" />
        </UDropdown>
        <UButton class="m-2" trailing-icon="i-mdi-send" @click="handleSendMessage" />
      </div>
    </div>

    <!-- </main> -->
    <div v-if="showAlert" class="mb-2">
      <UAlert color="red" variant="subtle" icon="i-mdi-alert-rhombus" title="Empty message"
        description="Please enter a message before sending." />
    </div>
  </div>
</template>

<script lang="ts" setup>
const store = useMyAppStore()
const showAlert = ref(false)
const newMessage = ref('')
const loadDate = ref(new Date());
const messagesView = ref();

onMounted(() => {
  loadDate.value = new Date();
})

watch(store, () => {
  setTimeout(() => messagesView.value.scrollTo(0, messagesView.value.scrollHeight), 100)
})

const currentUserAvatarUrl = computed(() => `https://robohash.org/${store.currentUser?.me?.username}`)

async function handleSendMessage() {
  try {
    await store.sendMessage(newMessage.value, "text");
    newMessage.value = "";
  } catch (e) {
    console.error("Failed to send message", e)
    showAlert.value = true
  }
}

const uploadItems = [
  [{
    label: 'Upload Image',
    icon: 'i-mdi-file-image-box',
    shortcuts: ['I'],
    click: () => {
      console.log('Image Uploaded')
    }
  }],
  [{
    label: 'Upload File',
    icon: 'i-mdi-paperclip',
    shortcuts: ['F'],
    click: () => {
      console.log('File Uploaded')
    }
  }]
]
</script>

<style scoped></style>
