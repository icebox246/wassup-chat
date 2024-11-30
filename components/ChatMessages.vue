<template>
  <div class="flex flex-col h-full w-full">
    <div class="w-full p-4">
      <div v-for="message in messages" :key="message.id" class="mb-2">
        <div class="flex items-start" :class="{'justify-end': message.isCurrentUser}">
          <UNotification
            :id="Date.now()"
            :description="message.content"
            :avatar="{ src: message.avatar }"
            :title="message.author"
            :close-button="
            { 
              icon: 'i-mdi-delete-outline', 
              color: 'primary', variant: 'outline', 
              padded: true, size: '2xs', 
              }"
            class="max-w-md break-words whitespace-normal"
          />
        </div>
      </div>
    </div>

    <div class="w-full p-4">
      <div class="flex flex-row items-center w-full">
        <UInput 
          v-model="newMessage" 
          placeholder="Type your message" 
          class="flex-grow m-2"
          @keyup.enter="sendMessage"
        >
          <template #leading>
            <UAvatar
              :src="`https://robohash.org/${store.currentUser?.username}`"
              size="2xs"
            />
          </template>
        </UInput>
        <UDropdown :items="upload_items" :popper="{ placement: 'bottom-start' }">
          <UButton class= "m-2" trailing-icon="i-mdi-folder-upload" />
        </UDropdown>
        <UButton class="m-2" trailing-icon="i-mdi-send" @click="sendMessage" />
      </div>
    </div>
      <div v-if="showAlert" class="mb-2">
        <UAlert
          color="red"
          variant="subtle"
          icon="i-mdi-alert-rhombus"
          title="Empty message"
          description="Please enter a message before sending."
        />
      </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const store = useMyAppStore() 
const current_username = store.currentUser?.username
const showAlert = ref(false)
const messages = ref([
  { id: 1, content: "Hello!", author: "PlaceholderMan", avatar: "https://robohash.org/placeholder", isCurrentUser: false }
]);


const newMessage = ref('')

const sendMessage = () => {
  if (newMessage.value.trim() === '') 
  {
    showAlert.value = true;
    return;
  }
  messages.value.push({
    id: Date.now(),
    content: newMessage.value,
    author: store.currentUser?.username,
    avatar: `https://robohash.org/${store.currentUser?.username}`,
    isCurrentUser: true
  });

  newMessage.value = '';
  showAlert.value = false;
}

const upload_items = [
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

<style scoped>
</style>
