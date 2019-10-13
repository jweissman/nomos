import { canvasExtensions } from "../Extends/Canvas"
import { Scene, Engine, Drawable, Vector } from "excalibur";
import { Worldlike, Person } from "../../ea/World";
import Dialogue from "../../ea/Dialogue";
import { SpriteDict } from "../Values/SpriteDict";
import { GameController, InputState } from "../GameController";
import Game from "../Game";

class DialogManager {
    constructor(public dialogue: Dialogue) {
    }
}

const noop = (_args: any) => {}
noop(canvasExtensions); // = true;

class Talk extends Scene {
    dialogue: Dialogue | undefined;
    person: Person | undefined;
    objects: Drawable[] = [];
    manager: DialogManager | undefined;
    controller: GameController;

    portrait: Drawable | undefined;

    constructor(private engine: Game, private world: Worldlike, private sprites: SpriteDict) {
        super(engine);
        this.controller = new GameController(engine);
    }

    onInitialize() { }

    onActivate() {
        if (this.engine.currentDialogue) {
            let { dialogue, person, backgroundObjects } = this.engine.currentDialogue;
            this.dialogue = dialogue;
            this.person = person;
            this.objects = backgroundObjects;
            this.portrait = this.sprites[person.kind];
            this.manager = new DialogManager(this.dialogue);
        } else {
            throw new Error("Switched to talk without a dialogue active?")
        }
    }

    onPreUpdate() {
        let input: InputState = this.controller.state();
        if (input.query) {
            let { lastScene } = this.engine
            console.log("GO TO BACK", { lastScene})
            this.engine.goToScene(lastScene)
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        let [w,h] = [
            this.engine.canvasWidth, 
            this.engine.canvasHeight
        ]
        let sz = 64, scale = 5
        if (this.objects.length) {
            let len = this.objects.length;
            this.objects.forEach((object,i) => {
                // let object = this.backgroundObjects[0]
                object.scale = new Vector(scale, scale)
                object.draw(ctx, ((i+1)*((w)/(len+1))) - (scale * sz), h / 2 - (scale * sz))
                object.scale = new Vector(1, 1)
            });
        }

        if (this.portrait) {
            this.portrait.scale=(new Vector(scale,scale))
            this.portrait.draw(ctx, 
                w/2 - (sz*scale), 
                h/4 - (sz*scale) 
            )
            this.portrait.scale=(new Vector(1,1))
        }

        

        if (this.dialogue && this.person) {
            let pad = 28
            this.dialogBox(ctx,
                pad,2*h/3 - pad,w - pad*2,h/3-pad,
                [this.person.name, 'Hello there!', 'How are you?']
            )
            // ctx.strokeStyle = '3px solid white'
            // ctx.roundRect(0,0,w/2,h/2,10).stroke()
            // ctx.fillStyle = 'black'
            // ctx.roundRect(0,0,w/2,h/2,10).fill()
        }
    }

    private dialogBox(
        ctx: CanvasRenderingContext2D,
        x: number, y: number, w: number, h: number,
        lines: string[]
    ) {
        ctx.fillStyle = 'black'
        ctx.roundRect(x, y, w, h, 10).fill()
        let borderThickness = 0.5
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 8
        let r = borderThickness;
        ctx.roundRect(x - r, y - r, w + 2*r, h + 2*r, 10).stroke()
        ctx.lineWidth = 0.6

        let [ox,oy] = [x+32,y+80]
        lines.forEach((line,i) => {
            ctx.fillStyle = 'white'
            if (i==0) {
                ctx.font = "bold 44pt Turret Road"
            } else {
                ctx.font = "44pt Turret Road"
            }
            // ctx.fontSize = 
            ctx.fillText(line, ox, oy + i*64, 400);
        })
    }
}

export default Talk;