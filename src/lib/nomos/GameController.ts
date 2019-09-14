import { Game } from "./Game";
import { Input } from "excalibur";

interface InputState {
    dx: number;
    dy: number;
    query: boolean;
    interact: boolean;
    zoom: boolean;
}

export class GameController {
    constructor(private game: Game) {
    }

    state(): InputState {
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
        }
        let [cx,cy,cq,ci,cz] = [
            pad.getAxes(Input.Axes.LeftStickX),
            pad.getAxes(Input.Axes.LeftStickY),
            pad.getButton(Input.Buttons.Face1), // a
            pad.getButton(Input.Buttons.Face3), // x
            pad.getButton(Input.Buttons.DpadUp), // x
        ];

        if (s.up)   { cy += -1; }
        if (s.down) { cy += 1; }
        if (s.left) { cx += -1; }
        if (s.right) { cx += 1; }

        let state: InputState = {
            dx: cx,
            dy: cy,
            query: s.query || !!cq,
            interact: s.interact || !!ci,
            zoom: s.zoom || !!cz,
        };
        return state;
    }

    private keyboard() { return this.game.input.keyboard; }
}
