import {
    Component,
    ElementRef,
    computed,
    effect,
    input,
    output,
    signal,
    viewChild,
    OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface VideoPlayerTimeUpdate {
    currentTime: number;
    duration: number;
    percent: number;
}

@Component({
    selector: 'bloc-video-player',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div
            class="bloc-video-player"
            [class.bloc-video-player--fullscreen]="isFullscreen()"
            (mouseenter)="showControls.set(true)"
            (mouseleave)="onMouseLeave()"
        >
            <video
                #videoElement
                class="bloc-video-player__video"
                [src]="src()"
                [poster]="poster()"
                [autoplay]="autoplay()"
                [loop]="loop()"
                [muted]="muted()"
                [preload]="preload()"
                (loadedmetadata)="onLoadedMetadata()"
                (timeupdate)="onTimeUpdate()"
                (play)="onPlayStateChange(true)"
                (pause)="onPlayStateChange(false)"
                (ended)="onEnded()"
                (waiting)="buffering.set(true)"
                (canplay)="buffering.set(false)"
                (volumechange)="onVolumeChange()"
                (click)="togglePlay()"
            ></video>

            @if (buffering()) {
                <div class="bloc-video-player__loader">
                    <div class="bloc-video-player__spinner"></div>
                </div>
            }

            <div
                class="bloc-video-player__controls"
                [class.bloc-video-player__controls--visible]="showControls() || !playing()"
            >
                <!-- Progress bar -->
                <div
                    class="bloc-video-player__progress"
                    (click)="onProgressClick($event)"
                    (mousemove)="onProgressHover($event)"
                    (mouseleave)="hoverPercent.set(-1)"
                >
                    <div class="bloc-video-player__progress-bar">
                        <div
                            class="bloc-video-player__progress-buffered"
                            [style.width.%]="bufferedPercent()"
                        ></div>
                        <div
                            class="bloc-video-player__progress-filled"
                            [style.width.%]="progressPercent()"
                        ></div>
                        @if (hoverPercent() >= 0) {
                            <div
                                class="bloc-video-player__progress-hover"
                                [style.left.%]="hoverPercent()"
                            ></div>
                        }
                    </div>
                </div>

                <div class="bloc-video-player__toolbar">
                    <!-- Play / Pause -->
                    <button
                        class="bloc-video-player__btn"
                        type="button"
                        [attr.aria-label]="playing() ? 'Pause' : 'Play'"
                        (click)="togglePlay()"
                    >
                        @if (playing()) {
                            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                <rect x="6" y="4" width="4" height="16" rx="1" />
                                <rect x="14" y="4" width="4" height="16" rx="1" />
                            </svg>
                        } @else {
                            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        }
                    </button>

                    <!-- Volume -->
                    <div class="bloc-video-player__volume-group">
                        <button
                            class="bloc-video-player__btn"
                            type="button"
                            aria-label="Toggle mute"
                            (click)="toggleMute()"
                        >
                            @if (currentVolume() === 0) {
                                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                    <path
                                        d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"
                                    />
                                </svg>
                            } @else if (currentVolume() < 0.5) {
                                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                    <path d="M18.5 12A4.5 4.5 0 0 0 16 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
                                </svg>
                            } @else {
                                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                    <path
                                        d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
                                    />
                                </svg>
                            }
                        </button>
                        <input
                            class="bloc-video-player__volume-slider"
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            [value]="currentVolume()"
                            aria-label="Volume"
                            (input)="onVolumeInput($event)"
                        />
                    </div>

                    <!-- Time display -->
                    <span class="bloc-video-player__time">
                        {{ formatTime(currentTime()) }} / {{ formatTime(duration()) }}
                    </span>

                    <!-- Right side controls -->
                    <div class="bloc-video-player__spacer"></div>

                    <!-- Playback rate -->
                    @if (showPlaybackRate()) {
                        <button
                            class="bloc-video-player__btn bloc-video-player__btn--text"
                            type="button"
                            aria-label="Playback speed"
                            (click)="cyclePlaybackRate()"
                        >
                            {{ playbackRate() }}x
                        </button>
                    }

                    <!-- Fullscreen -->
                    <button
                        class="bloc-video-player__btn"
                        type="button"
                        [attr.aria-label]="isFullscreen() ? 'Exit fullscreen' : 'Fullscreen'"
                        (click)="toggleFullscreen()"
                    >
                        @if (isFullscreen()) {
                            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                            </svg>
                        } @else {
                            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                            </svg>
                        }
                    </button>
                </div>
            </div>
        </div>
    `,
    styleUrl: './video-player.component.scss',
})
export class BlocVideoPlayerComponent implements OnDestroy {
    /* ── inputs ── */
    readonly src = input.required<string>();
    readonly poster = input('');
    readonly autoplay = input(false);
    readonly loop = input(false);
    readonly muted = input(false);
    readonly preload = input<'auto' | 'metadata' | 'none'>('metadata');
    readonly showPlaybackRate = input(true);

    /* ── outputs ── */
    readonly play = output<void>();
    readonly pause = output<void>();
    readonly ended = output<void>();
    readonly timeUpdate = output<VideoPlayerTimeUpdate>();

    /* ── internal state ── */
    readonly videoRef = viewChild<ElementRef<HTMLVideoElement>>('videoElement');
    readonly playing = signal(false);
    readonly buffering = signal(false);
    readonly currentTime = signal(0);
    readonly duration = signal(0);
    readonly currentVolume = signal(1);
    readonly playbackRate = signal(1);
    readonly isFullscreen = signal(false);
    readonly showControls = signal(true);
    readonly hoverPercent = signal(-1);
    readonly bufferedPercent = signal(0);

    readonly progressPercent = computed(() => {
        const d = this.duration();
        return d > 0 ? (this.currentTime() / d) * 100 : 0;
    });

    private hideControlsTimer: ReturnType<typeof setTimeout> | null = null;
    private fullscreenHandler = () => this.onFullscreenChange();

    private readonly mutedEffect = effect(() => {
        const video = this.videoRef()?.nativeElement;
        if (video) {
            video.muted = this.muted();
        }
    });

    constructor() {
        if (typeof document !== 'undefined') {
            document.addEventListener('fullscreenchange', this.fullscreenHandler);
        }
    }

    ngOnDestroy(): void {
        if (typeof document !== 'undefined') {
            document.removeEventListener('fullscreenchange', this.fullscreenHandler);
        }
        if (this.hideControlsTimer) {
            clearTimeout(this.hideControlsTimer);
        }
    }

    /* ── public API ── */

    togglePlay(): void {
        const video = this.videoRef()?.nativeElement;
        if (!video) return;
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }

    toggleMute(): void {
        const video = this.videoRef()?.nativeElement;
        if (!video) return;
        video.muted = !video.muted;
        if (video.muted) {
            this.currentVolume.set(0);
        } else {
            this.currentVolume.set(video.volume);
        }
    }

    toggleFullscreen(): void {
        const el = this.videoRef()?.nativeElement.closest('.bloc-video-player') as HTMLElement;
        if (!el) return;

        if (!document.fullscreenElement) {
            el.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    cyclePlaybackRate(): void {
        const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
        const idx = rates.indexOf(this.playbackRate());
        const next = rates[(idx + 1) % rates.length];
        this.playbackRate.set(next);
        const video = this.videoRef()?.nativeElement;
        if (video) {
            video.playbackRate = next;
        }
    }

    formatTime(seconds: number): string {
        if (!isFinite(seconds) || seconds < 0) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    /* ── event handlers ── */

    onLoadedMetadata(): void {
        const video = this.videoRef()?.nativeElement;
        if (video) {
            this.duration.set(video.duration);
            this.currentVolume.set(video.muted ? 0 : video.volume);
        }
    }

    onTimeUpdate(): void {
        const video = this.videoRef()?.nativeElement;
        if (!video) return;
        this.currentTime.set(video.currentTime);

        if (video.buffered.length > 0) {
            this.bufferedPercent.set((video.buffered.end(video.buffered.length - 1) / video.duration) * 100);
        }

        this.timeUpdate.emit({
            currentTime: video.currentTime,
            duration: video.duration,
            percent: video.duration > 0 ? (video.currentTime / video.duration) * 100 : 0,
        });
    }

    onPlayStateChange(isPlaying: boolean): void {
        this.playing.set(isPlaying);
        if (isPlaying) {
            this.play.emit();
            this.scheduleHideControls();
        } else {
            this.pause.emit();
        }
    }

    onEnded(): void {
        this.playing.set(false);
        this.ended.emit();
    }

    onVolumeChange(): void {
        const video = this.videoRef()?.nativeElement;
        if (video) {
            this.currentVolume.set(video.muted ? 0 : video.volume);
        }
    }

    onVolumeInput(event: Event): void {
        const video = this.videoRef()?.nativeElement;
        if (!video) return;
        const value = Number((event.target as HTMLInputElement).value);
        video.volume = value;
        video.muted = value === 0;
        this.currentVolume.set(value);
    }

    onProgressClick(event: MouseEvent): void {
        const video = this.videoRef()?.nativeElement;
        if (!video) return;
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        const percent = (event.clientX - rect.left) / rect.width;
        video.currentTime = percent * video.duration;
    }

    onProgressHover(event: MouseEvent): void {
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        this.hoverPercent.set(((event.clientX - rect.left) / rect.width) * 100);
    }

    onMouseLeave(): void {
        if (this.playing()) {
            this.scheduleHideControls();
        }
    }

    private scheduleHideControls(): void {
        if (this.hideControlsTimer) {
            clearTimeout(this.hideControlsTimer);
        }
        this.hideControlsTimer = setTimeout(() => {
            if (this.playing()) {
                this.showControls.set(false);
            }
        }, 3000);
    }

    private onFullscreenChange(): void {
        this.isFullscreen.set(!!document.fullscreenElement);
    }
}
