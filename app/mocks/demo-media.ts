/** Demo video source: stream + matching poster frame */
export interface DemoMediaSource {
    /** Video stream URL */
    streamUrl: string;
    /** Poster image URL */
    posterUrl: string;
}

/**
 * Public demo clips (Vidstack demo media + W3C test media) standing in for
 * real video streams (onboard cameras, stop photos/videos) until the real
 * API exists.
 */
export const DEMO_MEDIA_SOURCES: DemoMediaSource[] = [
    {
        streamUrl: 'https://files.vidstack.io/sprite-fight/720p.mp4',
        posterUrl: 'https://files.vidstack.io/sprite-fight/poster.webp'
    },
    {
        streamUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
        posterUrl: 'https://media.w3.org/2010/05/sintel/poster.png'
    },
    {
        streamUrl: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
        posterUrl: 'https://media.w3.org/2010/05/bunny/poster.png'
    }
];
