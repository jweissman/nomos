import { Input, Engine } from "excalibur";

export interface InputState {
    dx: number;
    dy: number;
    query: boolean;
    interact: boolean;
    zoom: boolean;
    attack: boolean;
    whistle: boolean;
}

export class GameController {
    constructor(private engine: Engine) {
    }

    state(): InputState {
        let mouse = this.mouse();
        let keyboard = this.keyboard();
        let pad = this.engine.input.gamepads.at(0);
        let s = {
            up:    keyboard.isHeld(Input.Keys.W),
            down:  keyboard.isHeld(Input.Keys.S),
            left:  keyboard.isHeld(Input.Keys.A),
            right: keyboard.isHeld(Input.Keys.D),
            query: keyboard.isHeld(Input.Keys.Q),
            interact: keyboard.isHeld(Input.Keys.E),
            zoom: keyboard.isHeld(Input.Keys.Z),
            whistle: keyboard.isHeld(Input.Keys.H),
            attack: mouse.isDragging,
        }

        let [cx, cy] = [
            pad.getAxes(Input.Axes.LeftStickX),
            pad.getAxes(Input.Axes.LeftStickY),
        ];

        let cQuery = pad.getButton(Input.Buttons.Face1); // a
        let cInteract = pad.getButton(Input.Buttons.Face3); // x
        let cUp = pad.getButton(Input.Buttons.DpadUp); // d-pad up
        let cDown = pad.getButton(Input.Buttons.DpadDown); // d-pad down
        let cAttack = pad.getButton(Input.Buttons.RightTrigger); // bam

        if (s.up)   { cy += -1; }
        if (s.down) { cy += 1; }
        if (s.left) { cx += -1; }
        if (s.right) { cx += 1; }

        let state: InputState = {
            dx: cx,
            dy: cy,
            query: s.query || !!cQuery,
            interact: s.interact || !!cInteract,
            zoom: s.zoom || !!cUp,
            attack: s.attack || !!cAttack,
            whistle: s.whistle || !!cDown,
        };
        return state;
    }

    private keyboard() { return this.engine.input.keyboard; }
    private mouse(): Input.Pointer { return this.engine.input.pointers.primary; }
}
