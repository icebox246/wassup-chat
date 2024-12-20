<template>
  <UButton color="gray" icon="i-mdi-file-download-outline" size="xl" @click.prevent="handleClick">
    {{ fields.filename }}
  </UButton>
</template>

<script lang="ts" setup>
const props = defineProps<{
  content: string
}>();

const fields = computed(() => {
  const [filename, url] = props.content.split(';');
  return { filename, url }
})

function handleClick() {
  const a = document.createElement("a");
  a.download = fields.value.filename;
  a.href = fields.value.url;
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a);
}
</script>

<style></style>