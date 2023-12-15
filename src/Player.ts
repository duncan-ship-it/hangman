import Two, { Vector } from "two.js";
import { Sprite } from "two.js/src/effects/sprite";
import { Text } from "two.js/src/text";
import Updatable from "./Updatable";

const SPRITE_COLS: number = 5;
const SPRITE_ROWS: number = 4;
const BALLOON_COUNT: number = 5;

export default class Player implements Updatable {
    private ctx: Two;
    private animation: Sprite;
    private exploded: boolean;
    private falling: boolean;
    private balloons: number;
    private animationPlaying: boolean;

    private animationQueue: number[];

    private static endFrames: number[] = [18, 15, 12, 9, 5];

    constructor(ctx: Two, x: number = ctx.width - 400, y: number = 150) {
        this.ctx = ctx;
        this.exploded = this.falling = false;
        this.balloons = BALLOON_COUNT;
        this.animation = new Sprite('./assets/sprites/player.png', x, y, SPRITE_COLS, SPRITE_ROWS, 5);
        this.animationPlaying = false;
        this.animationQueue = [];
        this.falling = false;

        this.ctx.add(this.animation);

        this.ctx.bind('explode', () => this.explode());
        this.ctx.bind('pop', () => this.popBalloon());
    }

    private popBalloon(): void {
        if (this.balloons === 0) return;


        console.log(`Balloons: ${this.balloons}`);
        if (--this.balloons === 0) {
            this.ctx.dispatchEvent('allPopped');  // player lost, disable game
        }
        
        if (this.animationPlaying)
            this.animationQueue.push(Player.endFrames[this.balloons]);
        else
            this.popAnimation(Player.endFrames[this.balloons]);
    }

    private popAnimation(lastFrame: number): void {
        this.animationPlaying = true;

        this.animation.play(this.animation.index, lastFrame, () => {
            if (this.animationQueue.length === 0) {
                this.animationPlaying = false;
                this.animation.pause();

                if (this.balloons === 0) {
                    this.falling = true;
                }

                return;
            }

            this.popAnimation(this.animationQueue.shift()!);  // run animation to next queued ending frame
        });
    }

    private get alive(): boolean {
        return !this.exploded && this.balloons !== 0;
    }

    private explode(): void {
        this.exploded = true;
        this.animation.pause();
        this.animation.index = SPRITE_COLS * SPRITE_ROWS - 1;
    }

    private reset(): void {
        this.animation.pause();
        this.exploded = false;
        this.balloons = BALLOON_COUNT;
        this.animation.index = 0;
    }

    public update(ctx: Two, framerate: number): void {
        if (this.alive) {
            this.animation.translation.y += (Math.sin(framerate / 150) / 15); 
        }
        else if (this.falling && !this.exploded && this.animation.translation.y < this.ctx.height + 100) {
            this.animation.translation.y += 10;
        }
    }
}