import { Game } from "./Game"; 
 import { Input } from "excalibur";

export interface InputState {
    dx: number;
    dy: number;
    query: boolean;
    interact: boolean;
    zoom: boolean;
    attack: boolean;
}

export class GameController {
    constructor(private game: Game) {
    }

    state(): InputState {
        let mouse = this.mouse();
        let keyboard = this.keyboard();
        let pad = this.game.input.gamepads.at(0);
        let s = {
            up:    keyboard.isHeld(Input.Keys.W),
            down:  keyboard.isHeld(Input.Keys.S),
            left:  keyboard.isHeld(Input.Keys.A),
            right: keyboard.isHeld(Input.Keys.D),
            query: keyboard.isHeld(Input.Keys.Q),
            interact: keyboard.isHeld(Input.Keys.E),
            zoom: keyboard.isHeld(Input.Keys.Z),
            attack: mouse.isDragging,
        }
        let [cx, cy] = [ //],cQuery,cInteract,cZoom,cAttack] = [
            pad.getAxes(Input.Axes.LeftStickX),
            pad.getAxes(Input.Axes.LeftStickY),
        ];

        let cQuery = pad.getButton(Input.Buttons.Face1); // a
        let cInteract = pad.getButton(Input.Buttons.Face3); // x
        let cZoom =pad.getButton(Input.Buttons.DpadUp); // d-pad up
        let cAttack = pad.getButton(Input.Buttons.RightBumper); // bump

        if (s.up)   { cy += -1; }
        if (s.down) { cy += 1; }
        if (s.left) { cx += -1; }
        if (s.right) { cx += 1; }

        let state: InputState = {
            dx: cx,
            dy: cy,
            query: s.query || !!cQuery,
            interact: s.interact || !!cInteract,
            zoom: s.zoom || !!cZoom,
            attack: s.attack || !!cAttack,
        };
        return state;
    }

    private keyboard() { return this.game.input.keyboard; }
    private mouse(): Input.Pointer { return this.game.input.pointers.primary; }
}
