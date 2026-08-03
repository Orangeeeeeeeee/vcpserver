<template>
    <media-player
        class="h-full w-full"
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
                class="vds-poster"
                :src="poster"
                :alt="title"
            />
        </media-provider>
        <media-video-layout :translations.prop="translations" />
    </media-player>
</template>

<script setup lang="ts">
import 'vidstack/player/styles/default/theme.css';
import 'vidstack/player/styles/default/layouts/video.css';
import 'vidstack/player';
import 'vidstack/player/layouts/default';
import 'vidstack/player/ui';
import type {
    DefaultLayoutWord,
    MediaLoadingStrategy,
    MediaPosterLoadingStrategy
} from 'vidstack';

/**
 * Vidstack video player (client-only web components) with the default video
 * layout and Ukrainian control labels. The parent controls the size — the
 * player fills its container.
 */

interface VideoPlayerProps {
    /** Media source URL (MP4/WebM, HLS `.m3u8` — hls.js is CDN lazy-loaded) */
    src: string;
    /** Accessible media title, also shown by the layout */
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

/** Ukrainian labels for the Vidstack default layout controls and menus */
const translations = computed<Partial<Record<DefaultLayoutWord, string>>>(
    () => ({
        Accessibility: t('player.accessibility'),
        Announcements: t('player.announcements'),
        Audio: t('player.audio'),
        Auto: t('player.auto'),
        Boost: t('player.boost'),
        'Caption Styles': t('player.captionStyles'),
        'Captions look like this': t('player.captionsLookLikeThis'),
        Captions: t('player.captions'),
        Chapters: t('player.chapters'),
        'Closed-Captions Off': t('player.closedCaptionsOff'),
        'Closed-Captions On': t('player.closedCaptionsOn'),
        Color: t('player.color'),
        Connected: t('player.connected'),
        Connecting: t('player.connecting'),
        Continue: t('player.continue'),
        Default: t('player.default'),
        Disabled: t('player.disabled'),
        Disconnected: t('player.disconnected'),
        'Display Background': t('player.displayBackground'),
        Download: t('player.download'),
        'Enter Fullscreen': t('player.enterFullscreen'),
        'Enter PiP': t('player.enterPip'),
        'Exit Fullscreen': t('player.exitFullscreen'),
        'Exit PiP': t('player.exitPip'),
        Family: t('player.family'),
        Font: t('player.font'),
        Fullscreen: t('player.fullscreen'),
        'Keyboard Animations': t('player.keyboardAnimations'),
        LIVE: t('player.live'),
        Loop: t('player.loop'),
        Mute: t('player.mute'),
        Normal: t('player.normal'),
        Off: t('player.off'),
        Opacity: t('player.opacity'),
        Pause: t('player.pause'),
        PiP: t('player.pip'),
        Play: t('player.play'),
        Playback: t('player.playback'),
        Quality: t('player.quality'),
        Replay: t('player.replay'),
        Reset: t('player.reset'),
        'Seek Backward': t('player.seekBackward'),
        'Seek Forward': t('player.seekForward'),
        Seek: t('player.seek'),
        Settings: t('player.settings'),
        Shadow: t('player.shadow'),
        Size: t('player.size'),
        'Skip To Live': t('player.skipToLive'),
        Speed: t('player.speed'),
        'Text Background': t('player.textBackground'),
        Text: t('player.text'),
        Track: t('player.track'),
        Unmute: t('player.unmute'),
        Volume: t('player.volume')
    })
);
</script>
