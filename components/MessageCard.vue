<template>
  <UPopover v-if="message" class="min-w-80 max-w-full">
    <UNotification :id="Date.now()" :avatar="{ src: `https://robohash.org/${message.author.username}` }"
      :close-button="{ icon: '', disabled: true }"
      :timeout="new Date(message.sentDate).getTime() > loadDate.getTime() - 3000 ? 1000 : 0"
      class="break-words whitespace-normal transition-colors dark:hover:bg-gray-800 hover:bg-gray-100 cursor-pointer">

      <template #title>
        {{ message.author.username }}
      </template>

      <template #description>
        <FileDownloadButton v-if="message.type == 'file'" :content="message.content" />
        <ImageAttachment v-else-if="message.type == 'image'" :content="message.content" />
        <span v-else class="dark:text-gray-100 text-gray-800">
          {{ message?.content }}
        </span>
      </template>
    </UNotification>

    <template #panel>
      <div class="grid gap-2 grid-cols-1 p-4">
        <UButton @click="copyMessage" icon="i-mdi-content-copy">
          Copy
        </UButton>
        <UButton v-if="byMe" @click="deleteMessage" icon="i-mdi-trashcan" color="red">
          Delete
        </UButton>
      </div>
    </template>
  </UPopover>
</template>

<script lang="ts" setup>
import type { Message, User } from '@prisma/client';

const store = useMyAppStore()
const toast = useToast()

const loadDate = ref(new Date());

onMounted(() => {
  loadDate.value = new Date();
})

const props = defineProps<{ message: Message & { author: User } }>()

const byMe = computed(() => {
  return store.currentUser?.me?.id == props.message.authorId
})

function deleteMessage() {
  store.deleteMessage(props.message.id);
}

const { copy } = useClipboard();

function copyMessage() {
  if (props.message.type == "text") {
    copy(props.message.content);
    toast.add({ icon: "i-mdi-content-copy", title: "Copied message to clipboard", timeout: 1000 });
  } else {
    const [_, url] = props.message.content.split(';');
    copy(location.origin + url)
    toast.add({ icon: "i-mdi-content-copy", title: "Copied attachment link to clipboard", timeout: 1000 });
  }
}
</script>

<style></style>
