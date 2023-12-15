import Two from "two.js";
import { Sprite } from "two.js/src/effects/sprite";
import MouseHelper from "./MouseHelper";
import Updatable from "./Updatable";
import { Text } from "two.js/src/text";

const ALPHABET: string = 'abcdefghijklmnopqrstuvwxyz';

const SPRITE_COLS: number = 2;
const SPRITE_ROWS: number = 1;

const KEYBOARD_LEFT: number = 150;
const KEYBOARD_TOP: number = 300;

const letterStyle = {
    family: 'Courier, monospace',
    size: 28,
    weight: 1000
}

export default class Letter implements Updatable {
	private ctx: Two;
	private used: boolean;

	private animation: Sprite;
	private letter: Text;

	constructor(ctx: Two, index: number) {
		this.ctx = ctx;
		this.used = false;

		const x: number = (index % 5) * 75 + KEYBOARD_LEFT;
		const y: number = Math.trunc(index / 5) * 75 + KEYBOARD_TOP;

		this.disable(false);

		this.animation = new Sprite('./assets/sprites/tile.png', x, y, SPRITE_COLS, SPRITE_ROWS, 100);
		this.ctx.add(this.animation);
		this.letter = this.ctx.makeText(ALPHABET[index].toUpperCase(), x, y + 3, letterStyle);

		this.registerClickEvent();

		this.ctx.bind('start', () => this.enable());
		this.ctx.bind('explode', () => this.disable());
		this.ctx.bind('allPopped', () => this.disable());
		this.ctx.bind('stop', () => this.disable(false));
		
	}

	private registerClickEvent(): void {
        window.addEventListener('pointerdown', (e: PointerEvent) => {
			if (this.used || !MouseHelper.rectCollide(this.ctx, e, this.animation))
				return;

			this.disable();
            
			this.ctx.dispatchEvent('guess', this.letter.value);
        });
    }

	public enable(): void {
		this.used = false;
		this.animation.index = 0;
	}

	private disable(cross: boolean = true): void {
		this.used = true;

		if (cross)
			this.animation.index = 1;
	}

	private reset(): void {
		this.enable();
	}

	public update(ctx: Two, framerate: number): void {
		
	}
}    