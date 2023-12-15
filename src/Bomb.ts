import Two from "two.js";
import { Sprite } from "two.js/src/effects/sprite";
import { Events } from "two.js/src/events";
import { Rectangle } from "two.js/src/shapes/rectangle";
import { Text } from "two.js/src/text";

import Updatable from "./Updatable"
import MouseHelper from "./MouseHelper";

const SPRITE_COLS: number = 5;
const SPRITE_ROWS: number = 19;

const MAX_SECONDS = 5 * 60;

const displayStyle = {
    family: 'monaco, Consolas, "Lucida Console", monospace',
    size: 18,
    weight: 1000
}

export default class Bomb implements Updatable {
    private ctx: Two;
    private enabled: boolean;
    private timer: number;
    private setTime: number;

    private animation: Sprite;
    private timerDisplay: Text;
    private startGameText: Text;

    private incrementButton: Rectangle;
    private decrementButton: Rectangle;
    private plantButton: Rectangle;

    private countdownSound: HTMLAudioElement;
    private explosionSound: HTMLAudioElement;

    constructor(ctx: Two, x: number = ctx.width - 200, y: number = ctx.height - 150, timer: number = 60 * 3.5) {
        this.ctx = ctx;
        this.setTime = timer;
        this.timer = timer;
        this.enabled = false;

        this.animation = new Sprite('./assets/sprites/bomb.png', x, y, SPRITE_COLS, SPRITE_ROWS, this.playback);
        this.ctx.add(this.animation);

        this.timerDisplay = this.ctx.makeText(this.time, x + 50, y + 7, displayStyle);
        this.startGameText = this.ctx.makeText('Start bomb play game', x + 50, y - 100, displayStyle);

        this.decrementButton = this.makeBombButton(x + 20, y + 40);
        this.incrementButton = this.makeBombButton(x + 55, y + 40);
        this.plantButton = this.makeBombButton(x + 90, y + 40);

        this.registerClickEvents();

        this.ctx.bind('explode', () => this.explode());
        this.ctx.bind('reset', () => this.reset());
        this.ctx.bind('stop', () => {
            this.enabled = false;
            this.animation.pause();
            this.startGameText.value = 'You won! (F5)';
            this.startGameText.visible = true;
        });

        this.countdownSound = new Audio('./assets/sounds/countdown.mp3');
        this.explosionSound = new Audio('./assets/sounds/explosion.mp3');

        this.pauseUnfocusedFeatures();  // ensure bomb animation and timer stay roughly in sync when page not in focus
    }

    private makeBombButton(x: number, y: number): Rectangle {
        const button = this.ctx.makeRectangle(x, y, 25, 20);
        button.noFill();
        button.noStroke();
        return button;
    }

    private registerClickEvents(): void {
        window.addEventListener('pointerdown', (e: PointerEvent) => {
            if (this.enabled) return;

            if (MouseHelper.rectCollide(this.ctx, e, this.incrementButton))
                this.incrementTimer();

            else if (MouseHelper.rectCollide(this.ctx, e, this.decrementButton))
                this.decrementTimer();

            else if (MouseHelper.rectCollide(this.ctx, e, this.plantButton))
                this.plant();
        });
    }

    private pauseUnfocusedFeatures(): void {
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                this.animation.pause();
            }
            else if (this.enabled)
                this.animation.play(undefined, SPRITE_ROWS * SPRITE_COLS, () => this.ctx.dispatchEvent('explode'));
        });
    }

    private incrementTimer(): void {
        this.timer = (this.timer + 15) % (MAX_SECONDS + 15);
        this.setTime = this.timer;
        this.animation.frameRate = this.playback;
    }

    private decrementTimer(): void {
        this.timer = (MAX_SECONDS + this.timer) % (MAX_SECONDS + 15);
        this.setTime = this.timer;
        this.animation.frameRate = this.playback;
    }

    private plant(): void {
        this.ctx.dispatchEvent('start');

        this.startGameText.visible = false;

        if (this.setTime === 0) {
            this.ctx.dispatchEvent('explode');
        }
        else {
            this.enabled = true;
            this.animation.play(1, SPRITE_ROWS * SPRITE_COLS, () => this.ctx.dispatchEvent('explode'));
        }
    }

    private explode(): void {
        this.animation.pause();
        this.animation.index = SPRITE_COLS * SPRITE_ROWS - 1;
        this.explosionSound.play();
        this.countdownSound.pause();
        this.timerDisplay.visible = false;
        this.enabled = false;
    }

    private reset(): void {
        this.timer = this.setTime;
        this.timerDisplay.visible = true;
        this.animation.stop();
    }

    private get time(): string {
        return `${Math.floor(this.timer / 60)}:${Math.round(this.timer % 60).toString().padStart(2, '0')}`;
    }

    private get playback(): number {
        return (SPRITE_ROWS * SPRITE_COLS - 3)/this.setTime;
    }

    public update(ctx: Two, framerate: number): void {
        this.timerDisplay.value = this.time;
        
        // TODO: timer does not decrement if browser is minimised, the animation is paused but still goes slightly out of sync
        if (framerate % 60 > 0) return;

        if (this.enabled && this.timer > 0) {
            this.timer--;

            if (this.timer === 9)
                this.countdownSound.play();
        }
            
    }
}