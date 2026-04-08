import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlocVideoPlayerComponent } from './video-player.component';

describe('BlocVideoPlayerComponent', () => {
    let component: BlocVideoPlayerComponent;
    let fixture: ComponentFixture<BlocVideoPlayerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BlocVideoPlayerComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BlocVideoPlayerComponent);
        fixture.componentRef.setInput('src', 'test-video.mp4');
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should format time correctly', () => {
        expect(component.formatTime(0)).toBe('0:00');
        expect(component.formatTime(65)).toBe('1:05');
        expect(component.formatTime(3661)).toBe('61:01');
    });

    it('should handle non-finite time', () => {
        expect(component.formatTime(NaN)).toBe('0:00');
        expect(component.formatTime(Infinity)).toBe('0:00');
        expect(component.formatTime(-1)).toBe('0:00');
    });

    it('should default to not playing', () => {
        expect(component.playing()).toBe(false);
    });

    it('should default to not buffering', () => {
        expect(component.buffering()).toBe(false);
    });

    it('should compute progress percent as 0 when duration is 0', () => {
        expect(component.progressPercent()).toBe(0);
    });
});
