<template>
    <div v-if="pageCount > 1" class="flex items-center justify-between gap-5 w-full">
        <button
            class="border-surface-300 size-10 lg:size-auto lg:border-none flex items-center min-h-[2.5rem] border px-2 gap-1.5 justify-center rounded-lg text-sm font-medium transition-colors duration-300 cursor-pointer text-surface-800 hover:bg-surface-200"
            :class="page === 0 ? 'pointer-events-none opacity-30' : ''"
            @click="goTo(page - 1)"
        >
            <Icon name="tabler:arrow-left" class="size-5" />
            <span class="hidden lg:block">Попередня</span>
        </button>

        <ul class="flex items-center gap-1">
            <li
                v-for="(item, index) in getPaginationRange(
                    page + 1,
                    pageCount,
                    isDesktop ? 1 : 0,
                    1,
                    isDesktop
                )"
                :key="`${item}-${index}`"
            >
                <span
                    v-if="item === 'ellipsis'"
                    class="flex items-center justify-center size-10 text-surface-500 select-none"
                >
                    …
                </span>
                <button
                    v-else
                    type="button"
                    class="flex items-center justify-center size-10 rounded-lg text-sm font-medium transition-colors duration-300 cursor-pointer"
                    :class="
                        item === page + 1
                            ? 'bg-surface-200 text-primary-950'
                            : 'text-surface-700 hover:bg-surface-200'
                    "
                    :aria-current="item === page + 1 ? 'page' : undefined"
                    @click="goTo(item - 1)"
                >
                    {{ item }}
                </button>
            </li>
        </ul>

        <button
            class="border-surface-300 size-10 lg:size-auto lg:border-none flex items-center min-h-[2.5rem] border px-2 gap-1.5 justify-center rounded-lg text-sm font-medium transition-colors duration-300 cursor-pointer text-surface-800 hover:bg-surface-200"
            :class="page >= pageCount - 1 ? 'pointer-events-none opacity-30' : ''"
            @click="goTo(page + 1)"
        >
            <span class="hidden lg:block">Наступна</span>
            <Icon name="tabler:arrow-right" class="size-5" />
        </button>
    </div>
</template>

<script setup lang="ts">
import { getPaginationRange } from '~/utils/pagination';
import { useMediaQuery } from '~/composables/useMediaQuery';

interface PaginationProps {
    /** Total number of pages. */
    pageCount: number;
}

const props = defineProps<PaginationProps>();

/** Zero-based current page (matches PrimeVue Paginator's `page`). */
const page = defineModel<number>('page', { default: 0 });

/** True on viewports >= md (768px); drives the page-number density. */
const isDesktop = useMediaQuery('(min-width: 768px)');

/** Navigate to a zero-based page index, clamped to range. */
const goTo = (index: number): void => {
    const clamped = Math.min(Math.max(0, index), props.pageCount - 1);
    if (clamped !== page.value) page.value = clamped;
};
</script>
