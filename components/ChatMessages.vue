<template>
  <div class="flex flex-col w-full max-h-[100vh] overflow-hidden">
    <header class="flex place-content-between w-full shadow-sm">
      <h2 class="text-xl p-4">
        {{ store.currentChannel?.name }}
      </h2>
      <ProfileCard />
    </header>

    <!-- <main v-if="store.currentChannel" class="flex flex-col"> -->

    <div class="w-full p-4 grow overflow-y-scroll" ref="messagesView">
      <div v-if="!store.currentChannel" class="flex flex-col justify-center text-center text-gray-600 h-full">
        No channel selected <br>
        <div class="p-6 flex items-center justify-center">
          <UIcon name="i-mdi-arrow-left-thin" class="text-3xl" color="gray-600" />
          Select a channel
        </div>
      </div>
      <div v-for="message in store.currentMessages" :key="message.id" class="mb-2">
        <div class="flex items-start" :class="{ 'justify-end': message.authorId == store.currentUser?.me?.id }">
          <MessageCard :message="message" />
        </div>
      </div>
    </div>

    <div class="w-full p-4" v-if="store.currentChannel != null">
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

    <FileMessageModal v-model="showFileUploadModal" :role="fileUploadRole" />

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
const messagesView = ref();
const showFileUploadModal = ref(false);
const fileUploadRole = ref("file")

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
      fileUploadRole.value = "image"
      showFileUploadModal.value = true;
    }
  }],
  [{
    label: 'Upload File',
    icon: 'i-mdi-paperclip',
    shortcuts: ['F'],
    click: () => {
      fileUploadRole.value = "file"
      showFileUploadModal.value = true;
    }
  }]
]
</script>

<style scoped></style>
