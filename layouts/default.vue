<template>
    <div class="flex items-stretch flex-col min-h-[100vh]">
        <header class="p-3 shadow-md">
            <NuxtLink to="/">
                <h1 class="flex items-center">
                    <UIcon name="i-mdi-chat-processing-outline" class="w-8 h-8 text-primary" /> WassupChat
                </h1>
            </NuxtLink>
        </header>
        <main class="grow flex items-center">
            <slot />
        </main>
    </div>
</template>
