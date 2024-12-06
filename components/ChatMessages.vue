<template>
  <div class="flex flex-col h-full w-full">
    <div class="w-full p-4">
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
          @keyup.enter="handleSendMessage">
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

onMounted(() => {
  loadDate.value = new Date();
})

const currentUserAvatarUrl = computed(() => `https://robohash.org/${store.currentUser?.me?.username}`)

async function handleSendMessage() {
  try {
    await store.sendMessage(newMessage.value, "text")
  } catch (e) {
    console.error("Failed to send message", e)
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
