<template>
    <div class="flex items-stretch flex-col min-h-[100vh]">
        <header class="flex flex-row items-center p-3 shadow-md">
            <NuxtLink to="/" class="grow">
                <h1 class="flex items-center">
                    <UIcon name="i-mdi-chat-processing-outline" class="w-8 h-8 text-primary" /> WassupChat
                </h1>
            </NuxtLink>
            <ProfileCard />
        </header>
        <main class="grow flex items-center">
            <slot />
        </main>
    </div>
</template>
