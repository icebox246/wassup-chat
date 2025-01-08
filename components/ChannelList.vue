<template>
  <div
    class="fixed z-40 sm:relative h-full bg-gray-100 dark:bg-gray-900 channel-panel flex flex-col shadow-md dark:border-r border-gray-700 transition-transform"
    :class="expanded ? '' : 'phidden'" ref="panel">
    <h2 class="text-xl p-4">Channels</h2>

    <div class="flex w-full">
      <UButton class="flex-1" :color="activeTab === 'public' ? 'primary' : 'gray'" @click="activeTab = 'public'">
        Channels
      </UButton>
      <UButton class="flex-1" :color="activeTab === 'private' ? 'primary' : 'gray'" @click="activeTab = 'private'">
        Friends
      </UButton>
    </div>

    <div class="flex flex-col p-4 grow overflow-auto">
      <div v-if="activeTab === 'public'">
        <div v-if="publicChannels.length" v-for="channel in publicChannels" :key="channel.id">
          <UButton variant="link" :id="`${channel.id}main`" :icon="store.currentChannelId === channel.id
            ? 'i-mdi-card-text'
            : 'i-mdi-card-text-outline'" :color="store.currentChannelId === channel.id ? 'primary' : 'gray'"
            @click="handleClickOnChannelItem(channel.id)" class="channel-button flex justify-between items-center mb-2">
            <span>{{ channel.name }} (#{{ channel.id }})</span>
            <template #trailing>
              <UButton @click.stop="openSettingsFor(channel.id, channel.name, channel.topic)" :id="`${channel.id}set`"
                variant="ghost" icon="i-mdi-cog-outline" color="gray" class="channel-button-settings" />
            </template>
          </UButton>
        </div>

        <div v-else>
          <p class="text-gray-500">No public channels available.</p>
        </div>
      </div>

      <div v-else-if="activeTab === 'private'">
        <div v-if="privateChannels.length" v-for="channel in privateChannels" :key="channel.id">
          <UButton variant="link" :id="`${channel.id}main`" :icon="store.currentChannelId === channel.id
            ? 'i-mdi-card-text'
            : 'i-mdi-card-text-outline'" :color="store.currentChannelId === channel.id ? 'primary' : 'gray'"
            @click="handleClickOnChannelItem(channel.id)" class="channel-button flex justify-between items-center mb-2">
            <span>
              <UAvatar size="xs" class="mr-1"
                :src="`https://robohash.org/${displayChannelName(channel as any as Channel)}`" />
              {{ displayChannelName(channel as any as Channel) }} (#{{ channel.id }})
            </span>
            <template #trailing>
              <UButton @click.stop="openSettingsFor(channel.id, channel.name, channel.topic)" :id="`${channel.id}set`"
                variant="ghost" icon="i-mdi-cog-outline" color="gray" class="channel-button-settings" />
            </template>
          </UButton>
        </div>
        <div v-else>
          <p class="text-gray-500">No private channels available.</p>
        </div>
      </div>
    </div>

    <UButton class="absolute sm:hidden top-[6em] right-[1em] transition-transform expand-button"
      :icon="expanded ? 'i-mdi-chevron-double-left' : 'i-mdi-chevron-double-right'" @click="expanded = !expanded" />

    <div class="p-4 pt-0 mt-auto">
      <div v-if="activeTab === 'public'" class="flex flex-col space-y-2">
        <UButton variant="solid" color="primary" @click="publicChannelCreationOpen = true" icon="i-mdi-plus">
          New Channel
        </UButton>
      </div>
      <div v-else-if="activeTab === 'private'" class="flex flex-col space-y-2">
        <UButton variant="solid" @click="privateChannelCreationOpen = true" icon="i-mdi-plus">
          Enter Friend Code
        </UButton>
      </div>
    </div>
  </div>


  <UModal v-model="publicChannelCreationOpen">
    <UCard>
      <template #header>
        <h2 class="text-3xl">Create Channel</h2>
      </template>
      <ChannelForm :mine="true" @submit="handlePublicSubmit" />
    </UCard>
  </UModal>

  <UModal v-model="privateChannelCreationOpen">
    <UCard>
      <template #header>
        <h2 class="text-3xl">Enter friend code</h2>
      </template>
      <PrivateChannelForm :mine="true" @submit="handlePrivateSubmit" />
    </UCard>
  </UModal>

  <UModal v-model="channelSettingsOpen">
    <UCard v-if="activeTab == 'public'">
      <template #header>
        <h2 class="text-3xl">Manage Channel</h2>
      </template>
      <ChannelForm :mine="store.currentChannel?.adminId === store.currentUser?.me?.id" v-model:channel="editingState"
        @submit="onSettingsSubmit" />
      <template v-if="store.currentChannel?.adminId === store.currentUser?.me?.id" #footer>
        <div class="flex gap-6">
          <UButton v-if="inviteLink" @click="copyInviteLink" color="primary" icon="i-mdi-account-multiple-plus-outline">
            Copy Invite Link
          </UButton>
          <UButton @click="handleDeleteChannel" icon="i-mdi-trash-can-outline" color="red">
            Delete Channel
          </UButton>
        </div>
      </template>
      <template v-else #footer>
        <div class="flex gap-6">
          <UButton @click="handleUnsubscribeChannel" icon="i-mdi-logout" color="red">
            Unsubscribe Channel
          </UButton>
        </div>
      </template>
    </UCard>
    <UCard v-else-if="activeTab == 'private'">
      <p>
        Do you want to leave direct message channel?
      </p>
      <UButton @click="handleUnsubscribeChannel" icon="i-mdi-logout" color="red">
        Leave Channel
      </UButton>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
import type { Channel } from '@prisma/client';
import { ref, onMounted, computed } from 'vue';

const expanded = ref(true);
const panel = ref<HTMLElement | null>(null);

useResizeObserver(panel, () => {
  expanded.value = true;
});

const store = useMyAppStore();
const toast = useToast();

const publicChannelCreationOpen = ref(false);
const privateChannelCreationOpen = ref(false);
const channelSettingsOpen = ref(false);

const editingChannelId = ref<number | null>(null);
const editingState = ref<any>({ name: '', topic: undefined });
const inviteLink = ref<string | null>(null);

const activeTab = ref<'public' | 'private'>('public');

const publicChannels = computed(() => {
  return store.subscribedChannels?.channels?.filter(
    (channel: any) => channel.isDirect === false
  ) ?? [];
});

const privateChannels = computed(() => {
  return store.subscribedChannels?.channels?.filter(
    (channel) => channel.isDirect === true
  ) ?? [];
});

function handleClickOnChannelItem(channelId: number) {
  store.currentChannelId = channelId;
}

async function openSettingsFor(id: number, name: string, topic: string | null) {
  channelSettingsOpen.value = true;
  editingChannelId.value = id;
  editingState.value = { name, topic: topic ?? '' };

  try {
    const { channel, err } = await $fetch(`/api/channel/${id}`, {
      method: 'PUT',
      body: { name, topic },
    });

    if (channel) {
      inviteLink.value = `${location.origin}/invite?inviteCode=${channel.inviteCode}`;
    } else {
      throw new Error('Channel data is undefined');
    }
  } catch (err) {
    inviteLink.value = null;
    toast.add({
      icon: "i-mdi-alert-circle",
      title: "Failed to fetch channel data",
      description: "An error occurred.",
      timeout: 3000,
      color: "red",
    });
    console.error(err);
  }
}

async function handlePublicSubmit(event: { data: any; errors: string[] }) {
  const { name, topic } = event.data;
  try {
    const body = { name, topic, isDirect: false };

    const { channel, err } = await $fetch('/api/channel', {
      method: 'POST',
      body,
    });

    if (!channel) {
      throw new Error("Explicitly failed to create channel");
    }

    toast.add({
      icon: "i-mdi-check-bold",
      title: "Created new public channel",
      timeout: 1000,
    });

    await store.fetchSubscribedChannels();
    publicChannelCreationOpen.value = false;
    store.currentChannelId = channel.id;
    activeTab.value = 'public';
  } catch (err: any) {
    toast.add({
      icon: "i-mdi-alert-circle",
      title: "Failed to create public channel",
      description: err.message || "An error occurred.",
      timeout: 3000,
      color: "red",
    });
    console.log(err);
  }
}

async function handlePrivateSubmit(event: { data: any; errors: string[] }) {
  const { inviteCode } = event.data;
  try {
    const body = { isDirect: true, inviteCode };

    const { channel, err } = await $fetch('/api/channel', {
      method: 'POST',
      body,
    });

    if (!channel) {
      throw new Error("Explicitly failed to create private channel");
    }

    toast.add({
      icon: "i-mdi-check-bold",
      title: "Created new private channel",
      timeout: 1000,
    });

    await store.fetchSubscribedChannels();
    privateChannelCreationOpen.value = false;
    store.currentChannelId = channel.id;
    activeTab.value = 'private';
  } catch (err: any) {
    toast.add({
      icon: "i-mdi-alert-circle",
      title: "Failed to create private channel",
      description: err.message || "An error occurred.",
      timeout: 3000,
      color: "red",
    });
    console.log(err);
  }
}

async function onSettingsSubmit(event: { data: any; errors: string[] }) {
  const { name, topic } = event.data;
  try {
    const { channel, err } = await $fetch(`/api/channel/${editingChannelId.value}`, {
      method: 'PUT',
      body: { name, topic },
    });

    if (!channel) {
      throw new Error("Explicitly failed to update channel");
    }

    toast.add({
      icon: "i-mdi-check-bold",
      title: "Updated channel",
      timeout: 1000,
    });

    await store.fetchSubscribedChannels();
    channelSettingsOpen.value = false;
    store.currentChannelId = channel.id;
  } catch (err) {
    toast.add({
      icon: "i-mdi-alert-circle",
      title: "Failed to update channel",
      description: "An error occurred.",
      timeout: 3000,
      color: "red",
    });
    console.log(err);
  }
}

async function handleDeleteChannel() {
  if (!confirm("Are you sure you want to delete this channel?")) {
    return;
  }

  try {
    const { err } = await $fetch(`/api/channel/${editingChannelId.value}`, {
      method: 'DELETE',
    });

    if (err) {
      throw new Error("Explicitly failed to delete channel");
    }

    toast.add({
      icon: "i-mdi-check-bold",
      title: "Deleted channel",
      timeout: 1000,
    });

    await store.fetchSubscribedChannels();
    channelSettingsOpen.value = false;
    store.currentChannelId = null;
  } catch (err) {
    toast.add({
      icon: "i-mdi-alpha-x-circle-outline",
      title: "Failed to delete channel",
      timeout: 1000,
    });
    console.log(err);
  }
}

async function copyInviteLink() {
  if (inviteLink.value) {
    try {
      await navigator.clipboard.writeText(inviteLink.value);
      toast.add({
        icon: "i-mdi-check-bold",
        title: "Invite link copied",
        timeout: 2000
      });
    } catch (err) {
      toast.add({
        icon: "i-mdi-alert",
        title: "Failed to copy invite link",
        timeout: 2000
      });
    }
  }
}

async function handleUnsubscribeChannel() {
  try {
    await $fetch("/api/channel/subscribed", {
      method: "DELETE",
      body: { channelId: store.currentChannelId }
    });
    channelSettingsOpen.value = false;
    store.currentChannelId = null;
    await store.fetchSubscribedChannels();
    store.webSocketReconnectFunctor?.call(globalThis);
  } catch (e) {
    toast.add({
      icon: "i-mdi-alpha-x-circle-outline",
      title: "Failed to unsubscribe channel",
      timeout: 1000,
    });
    console.error(e);
  }
}

function displayChannelName(channel: Channel) {
  if (!channel.isDirect) {
    return channel.name;
  }

  const currentUserName = store.currentUser?.me?.username;

  if (!channel.name) {
    return 'Private channel';
  }
  const splitted = channel.name.split(' ');

  const filtered = splitted.filter(u => u !== currentUserName);

  if (!filtered.length) {
    return channel.name;
  }

  return filtered.join(' ');
}

onMounted(async () => {
  await store.fetchSubscribedChannels();
});
</script>


<style scoped>
.channel-panel {
  width: max(30vw, 40ch);
}

.phidden .expand-button {
  transform: translateX(200%) rotate(180deg);
}

.phidden {
  transform: translateX(-100%);
}

.channel-button {
  width: 100%;
  justify-content: space-between;
  padding: 0.5rem;
  border-radius: 0.375rem;
}

.channel-button-settings {
  padding: 0;
}
</style>
