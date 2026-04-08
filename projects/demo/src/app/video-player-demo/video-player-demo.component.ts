import { Component, signal } from '@angular/core';
import { BlocVideoPlayerComponent, VideoPlayerTimeUpdate } from '@bloc-ui/video-player';

import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';

@Component({
    selector: 'app-video-player-demo',
    standalone: true,
    imports: [BlocVideoPlayerComponent, InstallCommandComponent, SampleCodeComponent],
    templateUrl: './video-player-demo.component.html',
})
export class VideoPlayerDemoComponent {
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
        basic: `<bloc-video-player
  src="https://example.com/video.mp4"
  poster="https://example.com/poster.jpg"
></bloc-video-player>`,
        autoplay: `<bloc-video-player
  src="https://example.com/video.mp4"
  [autoplay]="true"
  [loop]="true"
  [muted]="true"
></bloc-video-player>`,
        events: `<bloc-video-player
  src="https://example.com/video.mp4"
  (play)="onPlay()"
  (pause)="onPause()"
  (ended)="onEnded()"
  (timeUpdate)="onTimeUpdate($event)"
></bloc-video-player>`,
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
