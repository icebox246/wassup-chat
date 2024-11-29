<template>
  <UContainer class="flex flex-col items.stretch">
    <h2 class="text-xl">Channels</h2>
    <UButton @click="channelCreationOpen = true" icon="i-mdi-add"> New </UButton>
    <UContainer class="flex flex-col p-0 items-stretch grow">
      <UButton v-for="channel of store.subscribedChannels?.channels" variant="link" icon="i-mdi-card-text">
        {{ channel.name }}
      </UButton>
    </UContainer>
  </UContainer>

  <UModal v-model="channelCreationOpen">
    <UCard>
      <template #header>
        <h2 class="text-3xl">Create channel</h2>
      </template>

      <ChannelForm ref="form" @submit="onSubmit" />
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
import type { Form, FormSubmitEvent } from '#ui/types';

const store = useMyAppStore()
const toast = useToast()

const channelCreationOpen = ref(false);

const form = ref<{ form: Form<ChannelCreationSchema> }>()

async function onSubmit(event: FormSubmitEvent<ChannelCreationSchema>) {
  const { name, topic } = event.data
  try {
    await $fetch('/api/channel', { method: 'POST', body: { name, topic } })
    toast.add({
      icon: "i-mdi-check-bold", title: "Created new channel", timeout: 1000
    })
    console.log(store)
    await store.fetchSubscribedChannels()
    channelCreationOpen.value = false
  } catch (err) {
    form.value?.form!.setErrors([{
      message: "Failed to create channel",
      path: 'name',
    }]);
    console.log(err)
  }
}
</script>

<style></style>
