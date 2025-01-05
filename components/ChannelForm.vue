<template>
  <UForm @submit.prevent="handleSubmit" class="space-y-4">
    <UFormGroup label="Name" name="name">
      <UInput v-model="state.name" :disabled="!mine" />
    </UFormGroup>

    <UFormGroup label="Topic" name="topic">
      <UTextarea v-model="state.topic" :disabled="!mine" />
    </UFormGroup>

    <div v-if="errors.length" class="error-messages">
      <ul>
        <li v-for="(error, index) in errors" :key="index" class="text-red-500">{{ error }}</li>
      </ul>
    </div>

    <UButton type="submit" :disabled="!mine">
      {{ isEdit ? 'Update Channel' : 'Create Channel' }}
    </UButton>
  </UForm>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

interface PublicChannelFormSchema {
  name: string;
  topic?: string;
}

const props = defineProps<{
  mine: boolean;
  channel?: PublicChannelFormSchema;
}>();

const emit = defineEmits(['submit']);

const isEdit = computed(() => !!props.channel);

const state = ref<PublicChannelFormSchema>({
  name: props.channel?.name || '',
  topic: props.channel?.topic || '',
});

if (isEdit.value && props.channel) {
  state.value.name = props.channel.name;
  state.value.topic = props.channel.topic || '';
}

const errors = ref<string[]>([]);

function handleSubmit() {
  errors.value = [];

  if (!state.value.name.trim()) {
    errors.value.push('Name is required.');
  } else if (state.value.name.length > 100) {
    errors.value.push('Name cannot exceed 100 characters.');
  }

  if (state.value.topic && state.value.topic.length > 200) {
    errors.value.push('Topic cannot exceed 200 characters.');
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