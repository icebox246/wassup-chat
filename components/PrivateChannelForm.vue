<template>
  <UForm @submit.prevent="handleSubmit" class="space-y-4">
    <UFormGroup label="Invite Code" name="inviteCode">
      <UInput v-model="state.inviteCode" :disabled="!mine" />
    </UFormGroup>
    <p class="text-sm text-gray-500">
      Enter the invite code of the user you want to create a private channel with.
    </p>

    <div v-if="errors.length" class="error-messages">
      <ul>
        <li v-for="(error, index) in errors" :key="index" class="text-red-500">{{ error }}</li>
      </ul>
    </div>

    <UButton type="submit" :disabled="!mine">
      {{ isEdit ? 'Update Channel' : 'Create Private Channel' }}
    </UButton>
  </UForm>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

interface PrivateChannelFormSchema {
  inviteCode: string;
}

const props = defineProps<{
  mine: boolean;
  channel?: PrivateChannelFormSchema;
}>();

const emit = defineEmits(['submit']);

const isEdit = computed(() => !!props.channel);

const state = ref<PrivateChannelFormSchema>({
  inviteCode: props.channel?.inviteCode || '',
});

if (isEdit.value && props.channel) {
  state.value.inviteCode = props.channel.inviteCode || '';
}

const errors = ref<string[]>([]);

function handleSubmit() {
  errors.value = [];

  if (!state.value.inviteCode.trim()) {
    errors.value.push('Invite code is required for private channels.');
  } else if (state.value.inviteCode.length !== 36) {
    errors.value.push('Invite code must be 36 characters.');
  }

  if (errors.value.length > 0) {
    return;
  }

  emit('submit', { data: state.value, errors: [] });
}
</script>

<style scoped>
.error-messages {
  margin-top: 1rem;
}
</style>