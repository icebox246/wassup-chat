<template>
  <UContainer class="flex flex-col p-4 shadow-md items-stretch">
    <h2 class="text-xl">Channels</h2>
    <UButton @click="channelCreationOpen = true" icon="i-mdi-add"> New </UButton>
    <UContainer class="flex flex-col p-0 items-stretch grow">
      <UButton v-for="channel of store.subscribedChannels?.channels" variant="link"
        :icon="store.currentChannelId == channel.id ? 'i-mdi-card-text' : 'i-mdi-card-text-outline'"
        :color="store.currentChannelId == channel.id ? 'primary' : 'gray'"
        @click="handleClickOnChannelItem(channel.id)">
        {{ channel.name }} (#{{ channel.id }})
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

function handleClickOnChannelItem(channelId: number) {
  store.currentChannelId = channelId;
}

async function onSubmit(event: FormSubmitEvent<ChannelCreationSchema>) {
  const { name, topic } = event.data
  try {
    const { channel } = await $fetch('/api/channel', { method: 'POST', body: { name, topic } });
    if (!channel) {
      throw Error("Explicitely failed to create channel")
    }
    toast.add({
      icon: "i-mdi-check-bold", title: "Created new channel", timeout: 1000
    })
    console.log(store)
    await store.fetchSubscribedChannels()
    channelCreationOpen.value = false
    store.currentChannelId = channel.id;
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
