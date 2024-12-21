<template>
  <div v-if="!atEnd" class="flex flex-col items-center p-4 mb-4" ref="targetElem">
    <div class="text-gray-400 dark:text-gray-600">Loading messages</div>
    <UProgress class="max-w-[40%]" animation="carousel" />
  </div>
  <div v-else>
    <div class="text-gray-400 dark:text-gray-600 text-center p-4 pb-8">No earlier messages</div>
  </div>
</template>

<script lang="ts" setup>
const atEnd = ref(false);
const props = defineProps<{
  currentChannelId: number,
}>();
const targetElem = ref()
const fetching = ref(false);

const store = useMyAppStore();

watch(props, () => {
  atEnd.value = false;
  loadMoreMessages();
})

function loadMoreMessages() {
  if (!fetching.value) {
    fetching.value = true;

    setTimeout(async () => {
      const before = store.currentMessages?.at(0)?.sentDate?.getTime() ?? Date.now();

      try {
        const result = await $fetch(`/api/channel/${store.currentChannelId}/messages`, {
          query: { before }
        })
        if (result.err || !result.messages) throw Error("Explicit fail");

        if (result.messages.length < 16) {
          atEnd.value = true;
        }

        store.currentMessages?.splice(0, 0, ...result?.messages.map(m => {
          return {
            ...m,
            sentDate: new Date(m.sentDate),
            author: { ...m.author, registeredDate: new Date(m.author.registeredDate) }
          }
        }));
      } catch (e) {
        console.error(e);
      }

      setTimeout(() => fetching.value = false, 100)
    }, 100)
  }
}

useIntersectionObserver(targetElem, async ([entry]) => {
  if (!entry?.isIntersecting) return;
  loadMoreMessages();
})
</script>

<style></style>
