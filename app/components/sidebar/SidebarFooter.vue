<template>
    <div
        class="flex justify-between pt-6 pb-8 px-8 md:p-0 items-center md:items-stretch border-t border-t-[var(--p-surface-800)] md:border-none md:flex-col"
    >
        <div class="md:p-3">
            <div
                class="group flex items-center gap-3 md:w-full cursor-pointer"
                :class="
                    collapsed
                        ? 'justify-center'
                        : 'md:px-4 md:py-2 hover:bg-[var(--p-primary-900)] rounded-md transition-colors'
                "
            >
                <Avatar label="OR" shape="circle" class="shrink-0" />
                <div v-if="!collapsed" class="min-w-0 flex flex-col gap-1">
                    <p
                        class="text-sm font-semibold text-[var(--p-surface-300)] group-hover:text-[var(--p-surface-100)] truncate"
                    >
                        Olivia Rhye
                    </p>
                    <p
                        class="text-xs text-[var(--p-surface-500)] group-hover:text-[var(--p-primary-100)] truncate"
                    >
                        Logistics UA
                    </p>
                </div>
            </div>
        </div>
        <div
            class="flex items-center md:-order-1 md:items-stretch md:p-3 md:border-b md:border-b-[var(--p-surface-800)] md:justify-center"
            :class="collapsed ? 'flex-col gap-3' : 'gap-4'"
        >
            <button
                class="flex items-center justify-center text-[var(--p-surface-500)] hover:text-[var(--p-surface-50)] hover:bg-[var(--p-primary-900)] rounded-md transition-colors cursor-pointer shrink-0 size-12"
                @click="toggleTheme"
            >
                <Icon :name="themeIcon" class="size-6" />
            </button>
            <button
                class="flex items-center justify-center text-[var(--p-surface-500)] hover:text-[var(--p-surface-50)] hover:bg-[var(--p-primary-900)] transition-colors cursor-pointer shrink-0 size-12 rounded-md"
            >
                <Icon name="tabler:bell" class="size-6" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    collapsed: boolean;
}>();

const { toggleTheme, themeIcon } = useTheme();
</script>
