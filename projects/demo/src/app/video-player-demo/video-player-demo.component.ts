import { Component, signal } from '@angular/core';
import { BlocVideoPlayerComponent, VideoPlayerTimeUpdate } from '@bloc-ui/video-player';

import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';
import {
    ApiTableComponent,
    INPUTS_COLUMNS,
    OUTPUTS_COLUMNS,
    TOKENS_COLUMNS,
} from '../api-table/api-table.component';

import { BlocTabGroupComponent, BlocTabComponent } from '@bloc-ui/tab';

@Component({
    selector: 'app-video-player-demo',
    standalone: true,
    imports: [
        BlocVideoPlayerComponent,
        InstallCommandComponent,
        SampleCodeComponent,
        ApiTableComponent,
        BlocTabGroupComponent,
        BlocTabComponent,
    ],
    templateUrl: './video-player-demo.component.html',
})
export class VideoPlayerDemoComponent {
    readonly INPUTS_COLUMNS = INPUTS_COLUMNS;
    readonly OUTPUTS_COLUMNS = OUTPUTS_COLUMNS;
    readonly TOKENS_COLUMNS = TOKENS_COLUMNS;

    readonly inputs: string[][] = [
        ['src', 'string', 'required', 'Video source URL.'],
        ['poster', 'string', "''", 'Poster image URL shown before the video plays.'],
        [
            'autoplay',
            'boolean',
            'false',
            'Autoplays the video on load. Requires <code>[muted]="true"</code> to comply with browser policies.',
        ],
        ['loop', 'boolean', 'false', 'Restarts the video when it ends.'],
        ['muted', 'boolean', 'false', 'Starts the video muted.'],
        [
            'preload',
            "'auto' | 'metadata' | 'none'",
            "'metadata'",
            'Native video preload strategy hint.',
        ],
        [
            'showPlaybackRate',
            'boolean',
            'true',
            'Shows or hides the playback rate cycle button in the toolbar.',
        ],
    ];

    readonly outputs: string[][] = [
        ['play', 'void', 'Fired when the video starts playing.'],
        ['pause', 'void', 'Fired when the video is paused.'],
        ['ended', 'void', 'Fired when the video reaches the end.'],
        [
            'timeUpdate',
            'VideoPlayerTimeUpdate',
            'Fired on each time update. Payload: <code>{ currentTime, duration, percent }</code>.',
        ],
    ];

    readonly tokens: string[][] = [
        ['--bloc-video-player-radius', '0.5rem', 'Border radius of the player container.'],
        ['--bloc-video-player-accent', '#ef4444', 'Progress bar fill colour.'],
        [
            '--bloc-video-player-track',
            'rgba(255,255,255,0.25)',
            'Progress bar track (empty portion) background.',
        ],
        [
            '--bloc-video-player-buffered',
            'rgba(255,255,255,0.35)',
            'Buffered range indicator colour on the progress bar.',
        ],
    ];
    readonly currentTime = signal('0:00');
    readonly percent = signal(0);
    readonly eventLog = signal<string[]>([]);

    /** Public-domain sample videos */
    readonly sampleVideoSrc =
        'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4';
    readonly samplePoster =
        'https://upload.wikimedia.org/wikipedia/commons/7/70/Big.Buck.Bunny.-.Opening.Screen.png';

    readonly sintelSrc =
        'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4';

    readonly snippets = {
        basic: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-video-player
  src="https://example.com/video.mp4"
  poster="https://example.com/poster.jpg"
></bloc-video-player>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';
import { BlocVideoPlayerComponent } from '@bloc-ui/video-player';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [BlocVideoPlayerComponent],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  readonly videoSrc = 'https://example.com/video.mp4';
  readonly posterSrc = 'https://example.com/poster.jpg';
}`,
            },
        ],
        autoplay: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-video-player
  src="https://example.com/video.mp4"
  [autoplay]="true"
  [loop]="true"
  [muted]="true"
></bloc-video-player>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';
import { BlocVideoPlayerComponent } from '@bloc-ui/video-player';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [BlocVideoPlayerComponent],
  templateUrl: './example.component.html',
})
export class ExampleComponent {}`,
            },
        ],
        events: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-video-player
  src="https://example.com/video.mp4"
  (play)="onPlay()"
  (pause)="onPause()"
  (ended)="onEnded()"
  (timeUpdate)="onTimeUpdate($event)"
></bloc-video-player>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';
import { BlocVideoPlayerComponent, VideoPlayerTimeUpdate } from '@bloc-ui/video-player';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [BlocVideoPlayerComponent],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  onPlay(): void {
    console.log('Video started playing');
  }

  onPause(): void {
    console.log('Video paused');
  }

  onEnded(): void {
    console.log('Video ended');
  }

  onTimeUpdate(event: VideoPlayerTimeUpdate): void {
    console.log(event.currentTime, event.duration, event.percent);
  }
}`,
            },
        ],
    };

    onPlay(): void {
        this._log('▶ play');
    }

    onPause(): void {
        this._log('⏸ pause');
    }

    onEnded(): void {
        this._log('⏹ ended');
    }

    onTimeUpdate(event: VideoPlayerTimeUpdate): void {
        const mins = Math.floor(event.currentTime / 60);
        const secs = Math.floor(event.currentTime % 60);
        this.currentTime.set(`${mins}:${secs.toString().padStart(2, '0')}`);
        this.percent.set(Math.round(event.percent));
    }

    private _log(msg: string): void {
        this.eventLog.update((prev) => [msg, ...prev].slice(0, 8));
    }
}
