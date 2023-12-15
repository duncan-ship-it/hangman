import Updatable from "./Updatable";
import Two from 'two.js';
import { Text } from "two.js/src/text";

const letterStyle = {
    family: 'Courier, monospace',
    size: 30,
    weight: 1000,
    linewidth: 100
}

export default class Target implements Updatable {
    private ctx: Two;
    private categoryDisplay: Text;
    private targetDisplay: Text;
    private guesses: string[];
    private target: string;

    constructor(ctx: Two, x: number = 300, y: number = 100) {
        this.ctx = ctx;
        this.guesses = [];
        this.target = '';
        this.categoryDisplay = '';

        this.targetDisplay = ctx.makeText(this.obscuredTarget, x, y, letterStyle);

        this.categoryDisplay = ctx.makeText('', x, y - 60, letterStyle);

        this.ctx.bind('guess', (letter: string) => this.guess(letter));

        this.ctx.bind('explode', () => this.revealWord());
        this.ctx.bind('allPopped', () => this.revealWord());
        this.ctx.bind('start', () => this.generateTarget());
    }

    private guess(letter: string): void {
        this.guesses.push(letter);

        if (this.target.indexOf(letter) !== -1) {
            this.targetDisplay.value = this.obscuredTarget;

            if (this.target.split('').join(' ') === this.targetDisplay.value)
                this.ctx.dispatchEvent('stop');  // player won
        }
        else
            this.ctx.dispatchEvent('pop');
    }

    private revealWord(): void {
        if (this.target === '')
            this.generateTarget(() => this.targetDisplay.value = this.target.split('').join(' '));
        else
            this.targetDisplay.value = this.target.split('').join(' ');
    }

    private get obscuredTarget(): string {
        if (this.target === null)
            return '';

        const regex: RegExp = new RegExp(`[^${this.guesses.join('')}\\s\\-,\\.'"!]`, 'g');
        return this.target.replace(regex, '_').split('').join(' ');
    }

    private generateTarget(callback: Function): void {
        fetch('./assets/targets.json').then(res => 
            res.json().then(data => {
                const categories: string[] = Object.keys(data);

                const randCategory: string = categories[Math.floor(Math.random() * categories.length)];
                const randPhrase = data[randCategory][Math.floor(Math.random() * data[randCategory].length)];

                this.categoryDisplay.value = randCategory;
                this.target = randPhrase;
                this.targetDisplay.value = this.obscuredTarget;

                this.targetDisplay.size = 40 - (0.8 * this.target.length);
                callback();
            }
        ));
    }

    private reset(): void {
        this.guesses = [];
        this.generateTarget();
    }

    public update(ctx: Two, framerate: number): void {
        
    }
}