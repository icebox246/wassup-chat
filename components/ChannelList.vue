<template>
  <div class="channel-panel flex flex-col p-4 shadow-md items-stretch">
    <h2 class="text-xl">Channels</h2>
    <div class="flex flex-col p-0 items-stretch grow">
      <div v-if="store.subscribedChannels?.channels" v-for="channel of store.subscribedChannels.channels">
        <UButton variant="link" :key="channel.id" :id="channel.id + 'main'"
          :icon="store.currentChannelId == channel.id ? 'i-mdi-card-text' : 'i-mdi-card-text-outline'"
          :color="store.currentChannelId == channel.id ? 'primary' : 'gray'"
          @click="handleClickOnChannelItem(channel.id)" class="channel-button">
          {{ channel.name }} (#{{ channel.id }})

          <template #trailing>
            <UButton @click="openSettingsFor(channel.id, channel.name, channel.topic)" :id="channel.id + 'set'"
              variant="link" icon="i-mdi-cog-outline" color="gray" class="channel-button-settings" />
          </template>
        </UButton>
      </div>
      <div v-else v-for="i in 10" class="flex flex-row p-0 items-stretch grow">
        <USkeleton class="h-10 w-10 m-2" />
        <USkeleton class="h-10 grow m-2" />
      </div>
    </div>
    <UButton @click="channelCreationOpen = true" icon="i-mdi-add"> New </UButton>
  </div>

  <UModal v-model="channelCreationOpen">
    <UCard>
      <template #header>
        <h2 class="text-3xl">Create channel</h2>
      </template>

      <ChannelForm :mine="true" ref="form" @submit="onCreateSubmit" />
    </UCard>
  </UModal>

  <UModal v-model="channelSettingsOpen">
    <UCard>
      <template #header>
        <h2 class="text-3xl">Manage channel</h2>
      </template>

      <ChannelForm :mine="store.currentChannel?.adminId == store.currentUser?.me?.id" v-model:channel="editingState"
        @submit="onSettingsSubmit" />

      <template v-if="store.currentChannel?.adminId == store.currentUser?.me?.id" #footer>
        <div class="flex gap-6">
          <UButton v-if="inviteLink" @click="copyInviteLink" color="primary" icon="i-mdi-account-multiple-plus-outline">
            Copy invite link
          </UButton>
          <UButton @click="handleDeleteChannel" icon="i-mdi-trash-can-outline" color="red"> Delete channel </UButton>
        </div>
      </template>
      <template v-else #footer>
        <div class="flex gap-6">
          <UButton @click="handleUnsubscribeChannel" icon="i-mdi-logout" color="red"> Unsubscribe channel
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
import type { Form, FormSubmitEvent } from '#ui/types';
import type { Channel } from '@prisma/client';

const store = useMyAppStore()
const toast = useToast()

const channelCreationOpen = ref(false);
const channelSettingsOpen = ref(false);
const editingChannelId = ref(0);
const editingState = ref<ChannelFormSchema>({ name: 'foobar', topic: undefined });
const inviteLink = ref<string | null>(null);

const form = ref<{ form: Form<ChannelFormSchema> }>()

function handleClickOnChannelItem(channelId: number) {
  store.currentChannelId = channelId;
}

async function openSettingsFor(id: number, name: string, topic: string | null) {
  channelSettingsOpen.value = true;
  editingChannelId.value = id;
  editingState.value.name = name;
  editingState.value.topic = topic ?? undefined;
  try {
    const { channel, err } = await $fetch(`/api/channel/${editingChannelId.value}`, {
      method: 'PUT', body: { name, topic }
    });
    if (channel) {
      inviteLink.value = `${location.origin}/invite?inviteCode=${channel.inviteCode}`;
    } else {
      throw new Error('Channel data is undefined');
    }
  } catch (err) {
    inviteLink.value = null;
  }
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
    store.currentChannelId = null;
  } catch (err) {
    toast.add({
      icon: "i-mdi-alpha-x-circle-outline", title: "Failed to delete channel", timeout: 1000
    })
    console.log(err)
  }
}

async function copyInviteLink() {
  if (inviteLink.value) {
    try {
      await navigator.clipboard.writeText(inviteLink.value);
      toast.add({ icon: "i-mdi-check-bold", title: "Invite link copied", timeout: 2000 });
    } catch (err) {
      toast.add({ icon: "i-mdi-alert", title: "Failed to copy invite link", timeout: 2000 });
    }
  }
}

async function handleUnsubscribeChannel() {
  try {
    await $fetch("/api/channel/subscribed", { method: "DELETE", body: { channelId: store.currentChannelId } });
    channelSettingsOpen.value = false;
    store.currentChannelId = null;
    await store.fetchSubscribedChannels()
    // TODO: notify websockets to unsubscribe
  } catch (e) {
    toast.add({
      icon: "i-mdi-alpha-x-circle-outline", title: "Failed to unsubscribe channel", timeout: 1000
    })
    console.error(e);
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
