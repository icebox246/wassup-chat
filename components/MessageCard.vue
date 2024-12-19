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
        <span v-else class="dark:text-gray-100 text-gray-800">
          {{ message?.content }}
        </span>
      </template>
    </UNotification>

    <template #panel v-if="byMe">
      <div class="p-4">
        <UButton @click="deleteMessage" icon="i-mdi-trashcan">
          Delete
        </UButton>
      </div>
    </template>
  </UPopover>
</template>

<script lang="ts" setup>
import type { Message, User } from '@prisma/client';

const store = useMyAppStore()

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
</script>

<style></style>