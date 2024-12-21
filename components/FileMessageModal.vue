<template>
  <UModal v-model="shown">
    <UCard>
      <template #header>
        <h2 class="text-2xl">Upload a file</h2>
        <UContainer class="flex flex-col items-start">
          <label for="attachment-input" class="w-full">
            <UCard class="cursor-pointer p-3 my-4 bg-gray-100 dark:bg-gray-800 shadow-inner transition-all w-full">
              <div v-if="files.length == 0" class="text-l text-center w-full">
                <UIcon name="i-mdi-file-upload-outline" class="w-10 h-10 text-primary" /> <br>
                Drop a file here or click to select
              </div>
              <div v-else-if="role == 'file'" class="flex items-center justify-center text-l text-center w-full">
                <UIcon name="i-mdi-file-outline" class="w-7 h-7 mr-1 text-primary" /> {{ files[0].name }}
              </div>
              <div v-else-if="role == 'image'"
                class="flex flex-col items-center justify-center text-l text-center w-full">
                <img class="rounded-md max-w-48 max-h-48" :src="files[0].content?.toString()" />
                <span class="text-gray-400">
                  {{ files[0].name }}
                </span>
              </div>
            </UCard>
          </label>
          <input class="hidden" type="file" name="attachment" id="attachment-input" @input="handleFileInput">

          <UButton icon="i-mdi-send" @click="handleSend">
            Send
          </UButton>
        </UContainer>
      </template>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
const shown = defineModel<boolean>()
const props = defineProps<{
  role: string
}>()
const toast = useToast();
const store = useMyAppStore()

const { handleFileInput, files } = useFileStorage();

async function handleSend() {
  try {
    const res = await $fetch("/api/attachment", {
      method: "POST",
      body: { files: files.value }
    });
    if (res.err || !res.url) {
      throw new Error("Explicitely failed to upload an attachment")
    }

    await store.sendMessage(`${files.value[0].name};${res.url}`, props.role);

    shown.value = false;
  } catch (e) {
    console.error(e);
    toast.add({
      icon: "i-mdi-alpha-x-circle-outline", title: "Failed to post an attachment", timeout: 1000
    })
  }
}

watch(shown, (newShown) => {
  if (newShown)
    files.value = new Array();
})
</script>

<style></style>
