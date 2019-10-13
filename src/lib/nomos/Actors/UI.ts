import { UIActor, Label, Engine, Vector, Color, TextAlign } from "excalibur";
import Game from "../Game";

class Message extends UIActor {
    protected label: Label;
    constructor(protected message: string, protected engine: Engine) {
        super();
        this.label = this.buildMessage();
        this.setup()
    }

    setup() { this.add(this.label) }

    protected computePosition(cw: number, ch: number) {
        return new Vector(this.engine.canvasWidth / 2, 100)
    }

    onPreUpdate() {
        this.label.text = this.message;
        this.label.pos = this.computePosition(this.engine.canvasWidth, this.engine.canvasHeight);
        this.label.color = this.computeColor()
    }

    computeColor(): Color {
        return Color.White;
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
    get fontSize() { return 32; }
}

class Subheader extends Message {
    protected computePosition(cw: number, ch: number) {
        return new Vector(cw/2, 90)
    }

    get fontSize() { return 18; }
    get fontFamily() { return Game.fonts.secondary; }
}

class Log extends UIActor {
    lastSetAt: number = -1;
    constructor(private message: string, private engine: Game) {
        super();
        this.setMessage(message);
    }
    draw(ctx: CanvasRenderingContext2D, delta: number): void {
        if (this.message) {
            let now = new Date().getTime();
            let elapsed = now - this.lastSetAt;
            if (elapsed < 4000) {
                this.engine.graphics.dialogBox(ctx, [this.message])
            }
        }
    }
    setMessage(message: string) {
        this.message = message;
        this.lastSetAt = new Date().getTime();
    }
}

export { Log, Header, Subheader }