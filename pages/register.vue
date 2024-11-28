<template>
  <UContainer class="flex flex-col items-center">
    <UCard>
      <template #header>
        <h2 class="text-2xl">Sign up</h2>
      </template>

      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormGroup label="Username" name="username">
          <UInput v-model="state.username" />
        </UFormGroup>

        <UFormGroup label="Password" name="password">
          <UInput v-model="state.password" type="password" />
        </UFormGroup>

        <UFormGroup label="Repeat password" name="password_repeat">
          <UInput v-model="state.password_repeat" type="password" />
        </UFormGroup>

        <UButton type="submit">
          Register
        </UButton>
      </UForm>
    </UCard>
  </UContainer>
</template>

<script lang="ts" setup>
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'

const schema = object({
  username: string().required('Required'),
  password: string().required('Required'),
  password_repeat: string().required('Required').test('is-same-as-password', 'Passwords must match', (val) => val === state.password)
})

type Schema = InferType<typeof schema>

const state = reactive({
  username: undefined,
  password: undefined,
  password_repeat: undefined
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data)
}
</script>

<style></style>
