<template>
  <UForm ref="form" :schema="schema" :state="state" class="space-y-4">
    <UFormGroup label="Name" name="name">
      <UInput v-model="state.name" />
    </UFormGroup>

    <UFormGroup label="Topic" name="topic">
      <UTextarea v-model="state.topic" />
    </UFormGroup>

    <UButton type="submit">
      Save
    </UButton>
  </UForm>
</template>

<script lang="ts" setup>
import { object, string, type InferType } from 'yup';
import type { Form } from '#ui/types'

const store = useMyAppStore()
const toast = useToast()

const schema = object({
  name: string().required('Required'),
  topic: string(),
})

declare global {
  type ChannelFormSchema = InferType<typeof schema>
}

const form = ref<Form<ChannelFormSchema>>();

defineExpose({
  form
})

const state = defineModel<ChannelFormSchema>("channel", {
  default: {
    name: undefined,
    topic: undefined,
  }
})
</script>

<style></style>