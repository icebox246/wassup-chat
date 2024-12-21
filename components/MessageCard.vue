<template>
  <UPopover v-if="message" mode="hover">
    <div :timeout="new Date(message.sentDate).getTime() > loadDate.getTime() - 3000 ? 1000 : 0"
      class="flex transition-colors dark:hover:bg-gray-800 hover:bg-gray-100 cursor-pointer p-2 shadow-sm rounded-md border border-gray-600 max-w-[40vw]">
      <UAvatar class="mr-1" :src="`https://robohash.org/${message.author.username}`" />

      <div class="overflow-x-auto">
        <div>
          <span class="text-md text-gray-400 pr-1">
            {{ message.author.username }}
          </span>
          <span class="text-sm text-gray-600">
            {{ prettyDate }}
          </span>
        </div>

        <FileDownloadButton v-if="message.type == 'file'" :content="message.content" />
        <ImageAttachment v-else-if="message.type == 'image'" :content="message.content" />
        <span v-else class="break-words whitespace-normal dark:text-gray-100 text-gray-800 max-w-full">
          {{ message?.content }}
        </span>
      </div>
    </div>

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

const prettyDate = computed(() => {
  const format = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "2-digit"
  })

  try {
    return format.format(props.message.sentDate)
  } catch {
    return ""
  }
})
</script>

<style></style>
