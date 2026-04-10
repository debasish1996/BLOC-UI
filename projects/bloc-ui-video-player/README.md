# @bloc-ui/video-player

> **Latest:** v1.0.2

A feature-rich, customisable HTML5 video player component for Angular with built-in controls, keyboard accessibility, and CSS custom property theming.

**[Live Documentation & Demos](https://ui.bloc-verse.com/video-player)**

---

## Installation

```bash
npm install @bloc-ui/video-player
```

**Peer dependencies:** `@angular/common` and `@angular/core` ≥ 21.

---

## Selectors / API

| Export                      | Selector             | Type      | Description                               |
| --------------------------- | -------------------- | --------- | ----------------------------------------- |
| `BlocVideoPlayerComponent`  | `bloc-video-player`  | Component | Video player with full playback controls  |

---

## Usage

### Basic

```ts
import { BlocVideoPlayerComponent } from '@bloc-ui/video-player';
```

```html
<bloc-video-player
    src="https://example.com/video.mp4"
    poster="https://example.com/poster.jpg"
></bloc-video-player>
```

### With autoplay and loop

```html
<bloc-video-player
    src="https://example.com/video.mp4"
    [autoplay]="true"
    [loop]="true"
    [muted]="true"
></bloc-video-player>
```

### Listening to events

```html
<bloc-video-player
    src="https://example.com/video.mp4"
    (play)="onPlay()"
    (pause)="onPause()"
    (ended)="onEnded()"
    (timeUpdate)="onTimeUpdate($event)"
></bloc-video-player>
```

---

## Inputs — `BlocVideoPlayerComponent`

| Input              | Type                                | Default      | Description                                  |
| ------------------ | ----------------------------------- | ------------ | -------------------------------------------- |
| `src`              | `string`                            | *required*   | URL of the video source                      |
| `poster`           | `string`                            | `''`         | Poster image URL shown before playback       |
| `autoplay`         | `boolean`                           | `false`      | Auto-start playback on load                  |
| `loop`             | `boolean`                           | `false`      | Loop playback                                |
| `muted`            | `boolean`                           | `false`      | Start muted                                  |
| `preload`          | `'auto' \| 'metadata' \| 'none'`    | `'metadata'` | Preload strategy                             |
| `showPlaybackRate` | `boolean`                           | `true`       | Show playback rate toggle button             |

---

## Outputs

| Output       | Payload               | Description                                         |
| ------------ | --------------------- | --------------------------------------------------- |
| `play`       | `void`                | Emitted when playback starts                        |
| `pause`      | `void`                | Emitted when playback pauses                        |
| `ended`      | `void`                | Emitted when playback ends                          |
| `timeUpdate` | `VideoPlayerTimeUpdate` | Emitted on time update with currentTime, duration, percent |

---

## CSS Tokens

| Token                            | Fallback                       | Description                          |
| -------------------------------- | ------------------------------ | ------------------------------------ |
| `--bloc-video-player-radius`     | `0.5rem`                       | Container border radius              |
| `--bloc-video-player-track`      | `rgba(255, 255, 255, 0.25)`    | Progress bar track background        |
| `--bloc-video-player-buffered`   | `rgba(255, 255, 255, 0.35)`    | Buffered progress colour             |
| `--bloc-video-player-accent`     | `#ef4444`                      | Filled progress / accent colour      |
