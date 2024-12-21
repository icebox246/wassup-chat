<template>
  <UContainer class="flex flex-col items-center">
    <UCard>
      <template #header>
        <h2 class="text-2xl">Sign up</h2>
      </template>

      <UForm ref="form" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
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

        <ULink class="block text-primary" to="/login">
          Sign into existing account
        </ULink>
      </UForm>
    </UCard>
  </UContainer>
</template>

<script lang="ts" setup>
import type { Form, FormSubmitEvent } from '#ui/types';
import { object, string, type InferType } from 'yup';

const toast = useToast()

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

const form = ref<Form<Schema>>()
const store = useMyAppStore()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const { username, password } = event.data
  try {
    await $fetch('/api/register', { method: 'POST', body: { username, password } })
    toast.add({
      icon: "i-mdi-check-bold", title: "Registered new account", timeout: 1000
    })
    await store.fetchCurrentUser()
    navigateTo('/')
  } catch (err) {
    form.value!.setErrors([{
      message: "Failed to create user",
      path: 'username',
    }]);
    console.log(err)
  }
}
</script>

<style></style>
