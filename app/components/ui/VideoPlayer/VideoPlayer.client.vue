<template>
    <media-player
        class="group/player relative block h-full w-full overflow-hidden bg-surface-950 text-surface-100"
        :src="src"
        :title="title"
        :loop="loop"
        :muted="muted"
        :autoplay="autoplay"
        :load="load"
        :poster-load="posterLoad"
        playsinline
    >
        <media-provider>
            <media-poster
                v-if="poster"
                :src="poster"
                :alt="title"
                class="absolute inset-0 block opacity-0 transition-opacity data-[visible]:opacity-100 [&>img]:size-full [&>img]:object-cover"
            />
        </media-provider>

        <!-- Tap to play/pause, double tap to toggle fullscreen -->
        <media-gesture
            class="absolute inset-0 z-0 block"
            event="pointerup"
            action="toggle:paused"
        />
        <media-gesture
            class="absolute inset-0 z-0 block"
            event="dblpointerup"
            action="toggle:fullscreen"
        />

        <!-- Buffering indicator -->
        <div
            class="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity group-data-[buffering]/player:opacity-100"
        >
            <div
                class="size-10 animate-spin rounded-full border-[3px] border-white/25 border-t-white"
            />
        </div>

        <media-controls
            class="@container group/controls pointer-events-none absolute inset-0 z-20 flex flex-col justify-end opacity-0 transition-opacity data-[visible]:opacity-100"
        >
            <div
                class="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-surface-950/80 to-transparent"
            />

            <!-- Seek bar -->
            <media-controls-group
                class="pointer-events-none relative flex w-full items-center group-data-[visible]/controls:pointer-events-auto"
            >
                <media-time-slider
                    class="group/slider relative flex w-full cursor-pointer touch-none items-center outline-none select-none"
                    :aria-label="t('player.seek')"
                >
                    <div
                        class="relative h-[4px] w-full overflow-hidden bg-surface-100/20"
                    >
                        <div
                            class="absolute inset-y-0 left-0 w-[var(--slider-progress)] bg-surface-100"
                        />
                        <div
                            class="absolute inset-y-0 left-0 w-[var(--slider-fill)] bg-primary-300"
                        />
                    </div>
                    <div
                        class="absolute left-[var(--slider-fill)] size-3 -translate-x-1/2 rounded-full bg-white opacity-0 shadow-md transition-opacity group-hover/slider:opacity-100 group-data-[dragging]/slider:opacity-100"
                    />
                </media-time-slider>
            </media-controls-group>

            <!-- Bottom control bar -->
            <media-controls-group
                class="pointer-events-none relative flex w-full items-center gap-1 px-4 py-3 group-data-[visible]/controls:pointer-events-auto"
            >
                <div class="flex items-center justify-between gap-5 w-full">
                    <div class="flex items-center gap-4 text-xs">
                        <media-play-button
                            class="group/play flex size-6 lg:size-8 shrink-0 cursor-pointer items-center justify-center rounded-md outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/60"
                            :aria-label="t('player.play')"
                        >
                            <Icon
                                name="tabler:player-play"
                                class="hidden size-5 group-data-[paused]/play:block"
                            />
                            <Icon
                                name="tabler:player-pause"
                                class="block size-5 group-data-[paused]/play:hidden"
                            />
                        </media-play-button>

                        <div
                            class="mx-1 flex shrink-0 items-center gap-1 text-[13px] font-medium"
                        >
                            <media-time type="current" />
                            <span>/</span>
                            <media-time type="duration" />
                        </div>
                    </div>


                    <div class="flex items-center gap-3">
                        <!-- Volume -->
                        <div class="hidden items-center @sm:flex gap-2.5">
                            <media-mute-button
                                class="group/mute flex size-6 lg:size-8 shrink-0 cursor-pointer items-center justify-center rounded-md outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/60"
                                :aria-label="t('player.mute')"
                            >
                                <Icon
                                    name="tabler:volume"
                                    class="block size-5 group-data-[muted]/mute:hidden"
                                />
                                <Icon
                                    name="tabler:volume-off"
                                    class="hidden size-5 group-data-[muted]/mute:block"
                                />
                            </media-mute-button>
                            <media-volume-slider
                                class="group/volume relative flex h-5 w-16 cursor-pointer touch-none items-center outline-none select-none"
                                :aria-label="t('player.volume')"
                            >
                                <div
                                    class="relative h-[4px] w-full overflow-hidden rounded-full bg-surface-500"
                                >
                                    <div
                                        class="absolute inset-y-0 left-0 w-[var(--slider-fill)] bg-primary-300"
                                    />
                                </div>
                                <div
                                    class="absolute left-[var(--slider-fill)] size-2.5 -translate-x-1/2 rounded-full bg-white opacity-0 shadow-md transition-opacity group-hover/volume:opacity-100 group-data-[dragging]/volume:opacity-100"
                                />
                            </media-volume-slider>
                        </div>

                        <!-- Settings: playback speed -->
                        <media-menu class="relative hidden items-center @sm:flex">
                            <media-menu-button
                                class="flex size-6 lg:size-8 shrink-0 cursor-pointer items-center justify-center rounded-md outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/60"
                                :aria-label="t('player.settings')"
                            >
                                <Icon name="tabler:settings" class="size-5" />
                            </media-menu-button>
                            <media-menu-items
                                class="absolute right-0 bottom-full z-30 mb-2 hidden min-w-36 flex-col rounded-lg bg-surface-950/90 p-1 shadow-lg backdrop-blur-sm data-[open]:flex"
                            >
                                <div
                                    class="px-2.5 pt-1.5 pb-1 text-xs font-medium text-white/60"
                                >
                                    {{ t('player.speed') }}
                                </div>
                                <media-speed-radio-group>
                                    <media-radio
                                        v-for="rate in PLAYBACK_RATES"
                                        :key="rate.value"
                                        :value="rate.value"
                                        class="flex cursor-pointer items-center rounded-md px-2.5 py-1.5 text-[13px] outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/60 data-[checked]:bg-white/15"
                                    >
                                        {{ rate.label || t('player.normal') }}
                                    </media-radio>
                                </media-speed-radio-group>
                            </media-menu-items>
                        </media-menu>

                        <media-pip-button
                            class="hidden size-6 lg:size-8 shrink-0 cursor-pointer items-center justify-center rounded-md outline-none transition-colors @sm:flex hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/60 [&:not([data-supported])]:!hidden"
                            :aria-label="t('player.pip')"
                        >
                            <Icon name="tabler:picture-in-picture" class="size-5" />
                        </media-pip-button>

                        <media-fullscreen-button
                            class="group/fs flex size-6 lg:size-8 shrink-0 cursor-pointer items-center justify-center rounded-md outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/60 [&:not([data-supported])]:!hidden"
                            :aria-label="t('player.fullscreen')"
                        >
                            <Icon
                                name="tabler:maximize"
                                class="block size-5 group-data-[active]/fs:hidden"
                            />
                            <Icon
                                name="tabler:minimize"
                                class="hidden size-5 group-data-[active]/fs:block"
                            />
                        </media-fullscreen-button>
                    </div>
                </div>
            </media-controls-group>
        </media-controls>
    </media-player>
</template>

<script setup lang="ts">
import 'vidstack/player/styles/base.css';
import 'vidstack/player';
import 'vidstack/player/ui';
import type {
    MediaLoadingStrategy,
    MediaPosterLoadingStrategy
} from 'vidstack';

/**
 * Vidstack video player (client-only web components) with a custom minimal
 * layout: a single bottom bar — thin seek bar, play + time on the left,
 * volume / speed menu / PiP / fullscreen on the right. Styled with Tailwind
 * over headless Vidstack primitives (state comes via `data-*` attributes and
 * `--slider-*` CSS vars). Secondary controls hide on narrow players via
 * container queries. The parent controls the size — the player fills its
 * container.
 */

interface VideoPlayerProps {
    /** Media source URL (MP4/WebM, HLS `.m3u8` — hls.js is CDN lazy-loaded) */
    src: string;
    /** Accessible media title */
    title?: string;
    /** Poster image URL shown before playback */
    poster?: string;
    /** Media loading strategy (`play` defers loading until user intent) */
    load?: MediaLoadingStrategy;
    /** Poster loading strategy */
    posterLoad?: MediaPosterLoadingStrategy;
    /** Restart playback when the media ends */
    loop?: boolean;
    /** Start with the audio muted */
    muted?: boolean;
    /** Try to start playback as soon as the media is ready (may be blocked
     * by the browser — the player then falls back to the play button) */
    autoplay?: boolean;
}

withDefaults(defineProps<VideoPlayerProps>(), {
    title: '',
    poster: '',
    load: 'visible',
    posterLoad: 'visible',
    loop: false,
    muted: false,
    autoplay: false
});

const { t } = useI18n();

/** Speed menu options; empty label falls back to the «Normal» i18n label */
const PLAYBACK_RATES: { value: string; label: string }[] = [
    { value: '0.5', label: '0.5×' },
    { value: '1', label: '' },
    { value: '1.5', label: '1.5×' },
    { value: '2', label: '2×' }
];
</script>
