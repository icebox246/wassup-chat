<template>
  <UContainer class="channel-panel flex flex-col p-4 shadow-md items-stretch">
    <h2 class="text-xl">Channels</h2>
    <UButton @click="channelCreationOpen = true" icon="i-mdi-add"> New </UButton>
    <div class="flex flex-col p-0 items-stretch grow">
      <UButton v-if="store.subscribedChannels" v-for="channel of store.subscribedChannels.channels" variant="link"
        :icon="store.currentChannelId == channel.id ? 'i-mdi-card-text' : 'i-mdi-card-text-outline'"
        :color="store.currentChannelId == channel.id ? 'primary' : 'gray'" @click="handleClickOnChannelItem(channel.id)"
        class="channel-button">
        {{ channel.name }} (#{{ channel.id }})

        <template #trailing>
          <UButton @click="openSettingsFor(channel.id, channel.name, channel.topic)" variant="link"
            icon="i-mdi-cog-outline" color="gray" class="channel-button-settings" />
        </template>
      </UButton>
      <div v-else v-for="i in 10" class="flex">
        <USkeleton class="h-10 w-10 m-2" />
        <USkeleton class="h-10 grow m-2" />
      </div>
    </div>
  </UContainer>

  <UModal v-model="channelCreationOpen">
    <UCard>
      <template #header>
        <h2 class="text-3xl">Create channel</h2>
      </template>

      <ChannelForm ref="form" @submit="onCreateSubmit" />
    </UCard>
  </UModal>

  <UModal v-model="channelSettingsOpen">
    <UCard>
      <template #header>
        <h2 class="text-3xl">Manage channel</h2>
      </template>

      <ChannelForm v-model:channel="editingState" @submit="onSettingsSubmit" />

      <template #footer>
        <UButton @click="handleDeleteChannel" icon="i-mdi-trash-can-outline" color="red"> Delete channel </UButton>
      </template>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
import type { Form, FormSubmitEvent } from '#ui/types';

const store = useMyAppStore()
const toast = useToast()

const channelCreationOpen = ref(false);
const channelSettingsOpen = ref(false);
const editingChannelId = ref(0);
const editingState = ref<ChannelFormSchema>({ name: 'foobar', topic: undefined });

const form = ref<{ form: Form<ChannelFormSchema> }>()

function handleClickOnChannelItem(channelId: number) {
  store.currentChannelId = channelId;
}

function openSettingsFor(id: number, name: string, topic: string | null) {
  channelSettingsOpen.value = true;
  editingChannelId.value = id;
  editingState.value.name = name;
  editingState.value.topic = topic ?? undefined;
}

async function onCreateSubmit(event: FormSubmitEvent<ChannelFormSchema>) {
  const { name, topic } = event.data
  try {
    const { channel, err } = await $fetch('/api/channel', { method: 'POST', body: { name, topic } });
    if (!channel) {
      throw Error("Explicitely failed to create channel", err)
    }
    toast.add({
      icon: "i-mdi-check-bold", title: "Created new channel", timeout: 1000
    })
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

async function onSettingsSubmit(event: FormSubmitEvent<ChannelFormSchema>) {
  const { name, topic } = event.data
  try {
    const { channel, err } = await $fetch(`/api/channel/${editingChannelId.value}`, {
      method: 'PUT', body: { name, topic }
    });
    if (!channel) {
      throw Error("Explicitely failed to update channel", err)
    }
    toast.add({
      icon: "i-mdi-check-bold", title: "Updated channel", timeout: 1000
    })
    await store.fetchSubscribedChannels()
    channelSettingsOpen.value = false
    store.currentChannelId = channel.id;
  } catch (err) {
    console.log(err)
  }
}

async function handleDeleteChannel() {
  if (!confirm("Are you sure you want to delete this channel?")) {
    return;
  }

  try {
    const { err } = await $fetch(`/api/channel/${editingChannelId.value}`, {
      method: 'DELETE'
    });
    if (err) {
      throw Error("Explicitely failed to delete channel", err)
    }
    toast.add({
      icon: "i-mdi-check-bold", title: "Updated channel", timeout: 1000
    })
    await store.fetchSubscribedChannels()
    channelSettingsOpen.value = false
    store.currentChannelId = null
  } catch (err) {
    console.log(err)
  }

}
</script>

<style>
.channel-panel {
  width: max(30vw, 40ch);
}

.channel-button-settings {
  opacity: 0;
  margin-left: auto;
}

.channel-button:hover .channel-button-settings {
  opacity: 1;
}
</style>
