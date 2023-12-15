import Two from "two.js";
import { Rectangle } from "two.js/src/shapes/rectangle";


export default class MouseHelper {
    public static getDomCoords(element: HTMLElement): [x: number, y: number, width: number, height: number] {
        // https://stackoverflow.com/questions/5598743/finding-elements-position-relative-to-the-document
        const box = element.getBoundingClientRect();

        const scrollY: number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        const scrollX: number = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;

        const clientTop = document.documentElement.clientTop || document.body.clientTop || 0;
        const clientLeft = document.documentElement.clientLeft || document.body.clientLeft || 0;

        return [
            box.left + scrollX - clientLeft,
            box.top + scrollY - clientTop,
            box.width,
            box.height 
        ];
    }

    public static getMouseCoords(ctx: Two, event: MouseEvent | PointerEvent): [x: number, y: number] {
        const [sceneX, sceneY] = this.getDomCoords(ctx.renderer.domElement as HTMLElement);

        const scrollY: number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        const scrollX: number = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;

        const clientTop = document.documentElement.clientTop || document.body.clientTop || 0;
        const clientLeft = document.documentElement.clientLeft || document.body.clientLeft || 0;

        return [event.clientX - sceneX + scrollX - clientLeft, event.clientY - sceneY + scrollY - clientTop];
    }

    public static rectCollide(ctx: Two, event: MouseEvent | PointerEvent, rect: Rectangle): boolean {
        const [mouseX, mouseY]: [number, number] = this.getMouseCoords(ctx, event);

        const bound = rect.getBoundingClientRect();

        return bound.left <= mouseX && mouseX <= bound.right && 
            bound.top <= mouseY && mouseY <= bound.bottom;
    }
}