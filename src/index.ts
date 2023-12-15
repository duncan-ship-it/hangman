import Two from "two.js";
import Bomb from './Bomb';
import Updatable from './Updatable';
import Letter from './Letter';
import Player from "./Player";
import Target from "./Target";

const two: Two = new Two({
	type: Two.Types.canvas,
	width: 1200,
	height: 800,
	autostart: true
}).appendTo(document.body);

two.renderer.domElement.style.background = '#fff';

const entities: Updatable[] = [
	new Target(two),
	...Array.from({length: 26}, (_, i) => new Letter(two, i) as Updatable),
	new Bomb(two),
	new Player(two),
];

const update = (framerate: number): void => {
	entities.forEach(e => e.update(two, framerate));
}

two.bind('update', update);