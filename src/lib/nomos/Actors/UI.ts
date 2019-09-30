import { UIActor, Label, Engine, Vector, Color, TextAlign, Actor } from "excalibur";
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

class LogBox extends Actor {
    draw(ctx: CanvasRenderingContext2D) {
        let {x,y} = this.pos;
        let r = 120;
        // console.log({ opacity: this.opacity })
        ctx.fillStyle = `rgba(32,32,32,${this.opacity})`
        ctx.beginPath();
        ctx.fillRect(0,y-60,8000,r);
        ctx.fill();
    }
}

class Log extends Message {
    ticks: number = 0;
    logbox!: LogBox;
    constructor(protected message: string, protected engine: Engine) {
        super(message, engine)
    }
    setup() {
        this.logbox = new LogBox()
        this.add(this.logbox)
        super.setup();
    }
    protected computePosition(cw: number, ch: number) {
        this.ticks++;
        let dy = (this.ticks - this.lastSet)/2300;
        let op = dy > 0.25 ? 0 : Math.max(1 - dy, 0)
        this.logbox.opacity = op - 0.6
        let pos = new Vector(cw/2, ch-150)
        this.logbox.pos = pos
        this.label.opacity = op
        return pos
    }
    get fontSize() { return 16; }
    get fontFamily() { return Game.fonts.secondary; }
    setMessage(message: string) {
        this.message = message;
        this.lastSet = this.ticks;
    }
    lastSet: number = 0

}

export { Log, Header, Subheader }