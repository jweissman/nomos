import { Engine, Input } from "excalibur";

export interface InputState {
    dx: number;
    dy: number;
    accelerate: boolean;
    query: boolean;
    interact: boolean;
    zoom: boolean;
    attack: boolean;
    heavyAttack: boolean;
    whistle: boolean;
    meditate: boolean;

    start: boolean;
    yes: boolean;
    // numOne: boolean;
    // numTwo: boolean;
}

export class GameController {
    constructor(private engine: Engine) {
    }

    public state(): InputState {
        const mouse = this.mouse();
        const keyboard = this.keyboard();
        const pad = this.engine.input.gamepads.at(0);
        const s = {
            up:    keyboard.isHeld(Input.Keys.W),
            down:  keyboard.isHeld(Input.Keys.S),
            left:  keyboard.isHeld(Input.Keys.A),
            right: keyboard.isHeld(Input.Keys.D),
            start: keyboard.isHeld(13), // Input.Keys.Enter),
            query: keyboard.isHeld(Input.Keys.Q),
            accelerate: keyboard.isHeld(Input.Keys.Shift),
            interact: keyboard.isHeld(Input.Keys.E),
            zoom: keyboard.isHeld(Input.Keys.Z) && !keyboard.isHeld(Input.Keys.Shift),
            whistle: keyboard.isHeld(Input.Keys.H),
            meditate: keyboard.isHeld(Input.Keys.Z) && keyboard.isHeld(Input.Keys.Shift),
            attack: mouse.isDragStart || keyboard.wasPressed(Input.Keys.Space),
            heavyAttack: mouse.isDragStart && keyboard.isHeld(Input.Keys.Shift),
            // numpadOne: keyboard.wasPressed(Input.Keys.Num1),
            // numpadTwo: keyboard.wasPressed(Input.Keys.Num2),
            yes: keyboard.isHeld(Input.Keys.Space),
        };

        let [cx, cy] = [
            pad.getAxes(Input.Axes.LeftStickX),
            pad.getAxes(Input.Axes.LeftStickY),
        ];
        // if (pad.getAxes(Input.Axes.RightStickX))

        const cYes = pad.getButton(Input.Buttons.Face1); // a
        // let cNo = pad.getButton(Input.Buttons.Face2); // b
        const cInteract = pad.getButton(Input.Buttons.Face3); // x
        const cQuery = pad.getButton(Input.Buttons.Face4); // x
        const cUp = pad.getButton(Input.Buttons.DpadUp); // d-pad up
        const cDown = pad.getButton(Input.Buttons.DpadDown); // d-pad down
        const cStart = pad.getButton(Input.Buttons.Start);
        const cSelect = pad.getButton(Input.Buttons.Select);
        const cAttack = pad.isButtonPressed(Input.Buttons.RightBumper); // bam
        const cAttackHeavy = pad.isButtonPressed(Input.Buttons.RightTrigger); // bam

        if (s.up)   { cy += -1; }
        if (s.down) { cy += 1; }
        if (s.left) { cx += -1; }
        if (s.right) { cx += 1; }

        const state: InputState = {
            dx: cx,
            dy: cy,
            accelerate: s.accelerate || !!cYes,
            query: s.query || !!cQuery,
            interact: s.interact || !!cInteract,
            zoom: s.zoom || !!cUp,
            attack: s.attack || !!cAttack,
            heavyAttack: s.heavyAttack || !!cAttackHeavy,
            whistle: s.whistle || !!cDown,
            meditate: s.meditate || !!cSelect,
            start: s.start || !!cStart,
            yes: s.yes || s.interact || !!cYes,
            // numOne: s.numpadOne || !!cInteract || s.interact,
            // numTwo: s.numpadTwo,
        };
        return state;
    }

    private keyboard() { return this.engine.input.keyboard; }
    private mouse(): Input.Pointer { return this.engine.input.pointers.primary; }
}
