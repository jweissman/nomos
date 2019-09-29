import { UIActor, Label, Engine, Vector, Color, TextAlign } from "excalibur";
import Game from "../Game";

class Message extends UIActor {
    protected label: Label;
    constructor(protected message: string, protected engine: Engine) {
        super();
        this.label = this.buildMessage();
        this.add(this.label);
    }

    protected computePosition(cw: number, ch: number) {
        return new Vector(this.engine.canvasWidth / 2, 100)
    }

    onPreUpdate() {
        this.label.text = this.message;
        this.label.pos = this.computePosition(this.engine.canvasWidth, this.engine.canvasHeight);
    }

    setMessage(message: string) {
        this.message = message;
    }

    protected buildMessage(): Label { 
        let msgLabel = new Label(this.message);
        msgLabel.fontFamily = this.fontFamily;
        msgLabel.color = Color.White;
        msgLabel.fontSize = this.fontSize;
        msgLabel.textAlign = TextAlign.Center;
        return msgLabel;
    }

    get fontSize() { return 50; }
    get fontFamily() { return Game.fonts.primary; }
}

class Header extends Message {
    protected computePosition(cw: number, ch: number) {
        return new Vector(cw/2, 70)
    }
    get fontSize() { return 40; }
}

class Subheader extends Message {
    protected computePosition(cw: number, ch: number) {
        return new Vector(cw/2, 90)
    }

    get fontSize() { return 20; }
    get fontFamily() { return Game.fonts.secondary; }
}

class Log extends Message {
    ticks: number = 0;
    protected computePosition(cw: number, ch: number) {
        this.ticks++;
        let dy = (this.ticks - this.lastSet)/10;
        return new Vector(cw/2, ch-150+Math.max(dy,30))
    }
    get fontSize() { return 24; }
    // get fontFamily() { return Game.fonts.secondary; }
    setMessage(message: string) {
        this.message = message;
        this.lastSet = this.ticks;
    }
    lastSet: number = 0

}

// class Focus extends Actor {
//     constructor() {
//         super(0,0,80,80,Color.Red);
//     }
// }

export { Log, Header, Subheader }