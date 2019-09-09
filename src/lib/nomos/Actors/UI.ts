import { UIActor, Label, Engine, Vector, Color, TextAlign, Actor } from "excalibur";

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
        msgLabel.fontFamily = 'Segoe UI Light';
        msgLabel.color = Color.White;
        msgLabel.fontSize = this.fontSize;
        msgLabel.textAlign = TextAlign.Center;
        return msgLabel;
    }

    get fontSize() { return 50; }
}

class Header extends Message {
    protected computePosition(cw: number, ch: number) {
        return new Vector(cw/2, 70)
    }
    get fontSize() { return 36; }
}

class Subheader extends Message {
    protected computePosition(cw: number, ch: number) {
        return new Vector(cw/2, 90)
    }

    get fontSize() { return 20; }
}

class Log extends Message {
    protected computePosition(cw: number, ch: number) {
        return new Vector(cw/2, ch-50)
    }
    get fontSize() { return 14; }
}

class Focus extends Actor {
    constructor() {
        super(0,0,80,80,Color.Red);
    }
}

export { Log, Focus, Header, Subheader }