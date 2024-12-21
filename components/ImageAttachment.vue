<template>
  <div class="flex justify-center">
    <img class="rounded-md max-w-48 max-h-48" :src="fields.url" @click.prevent="handleClick" />
  </div>

  <UModal v-model="showPreview">
    <UCard>
      <img class="rounded-md m-auto" :src="fields.url" />
      <template #footer>
        <FileDownloadButton :content="content" />
      </template>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
const showPreview = ref(false);

const props = defineProps<{
  content: string
}>();

const fields = computed(() => {
  const [filename, url] = props.content.split(';');
  return { filename, url }
})

function handleClick() {
  showPreview.value = true;
}
</script>

<style></style>
