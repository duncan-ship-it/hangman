import Two from "two.js";

export default interface Updatable {
    update(ctx: Two, framerate: number): void;
}