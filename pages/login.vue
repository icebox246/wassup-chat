<template>
  <UContainer class="flex flex-col items-center">
    <UCard>
      <template #header>
        <h2 class="text-2xl">Sign in</h2>
      </template>

      <UForm ref="form" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormGroup label="Username" name="username">
          <UInput v-model="state.username" />
        </UFormGroup>

        <UFormGroup label="Password" name="password">
          <UInput v-model="state.password" type="password" />
        </UFormGroup>

        <UButton type="submit">
          Log in
        </UButton>
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
  password: string().required('Required')
})

type Schema = InferType<typeof schema>

const state = reactive({
  username: undefined,
  password: undefined
})

const form = ref<Form<Schema>>()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const { username, password } = event.data;
  try {
    await $fetch('/api/login', { method: 'POST', body: { username, password } })
    toast.add({
      icon: "i-mdi-check-bold", title: "Logged in", timeout: 1000
    })
    navigateTo('/')
  } catch (err) {
    form.value!.setErrors([{
      message: "Wrong username or password",
      path: 'username',
    }]);
    console.log(err)
  }
}
</script>

<style></style>
