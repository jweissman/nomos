import { canvasExtensions } from "../Extends/Canvas"
import { Scene, Drawable, Vector } from "excalibur";
import { Worldlike, Person } from "../../ea/World";
import Dialogue, { DialogTopic, Question } from "../../ea/Dialogue";
import { SpriteDict } from "../Values/SpriteDict";
import { GameController, InputState } from "../GameController";
import Game from "../Game";

type DialogActivity = 'picking-topic' | 'picking-question' | 'answering-question'
class DialogManager {
    public state: {
        activity: DialogActivity,
        topic?: DialogTopic
        question?: Question
    } = {
        activity: 'picking-topic'
    }

    constructor(public dialogue: Dialogue) {
    }

    get currentLines(): string[] {
        if (this.state.activity ==='picking-topic') {
            return [`What would you like to talk about?`]
        } else if (this.state.activity === 'picking-question') {
            return [`What would you like to ask?`]
        } else if (this.state.activity === 'answering-question') {
            if (this.state.question) {
                return this.state.question.answer;
            }
        } 
        return [`What's up?`]
    }

    get currentOptions(): string[] {
        if (this.state.activity === 'picking-topic') {
        return this.dialogue.topics.map(topic => topic.kind);
        } else if (this.state.activity === 'picking-question') {
            if (this.state.topic) {
                return this.state.topic.questions.map(question => question.question)
            }
        }
        return [];
    }

    selectOption(index: number) {
        console.log("SELECT OPT", index);
       if (this.state.activity === 'picking-topic') {
           this.state.topic = this.dialogue.topics[index]
           this.state.activity = 'picking-question'
       } else if (this.state.activity === 'picking-question') {
           if (this.state.topic) {
               this.state.question = this.state.topic.questions[index];
               this.state.activity = 'answering-question'
           }
       } else {
           console.warn("not sure what to do with selection ", index, this.state.activity)
       }
    }
}

const noop = (_args: any) => {}
noop(canvasExtensions); // = true;

class Talk extends Scene {
    dialogue: Dialogue | undefined;
    person: Person | undefined;
    objects: Drawable[] = [];
    director: DialogManager | undefined;
    controller: GameController;

    portrait: Drawable | undefined;

    lastSelectedAt: number = -1;

    constructor(private engine: Game, private _world: Worldlike, private sprites: SpriteDict) {
        super(engine);
        this.controller = new GameController(engine);
    }

    onInitialize() { }

    onActivate() {
        this.lastSelectedAt = new Date().getTime();
        if (this.engine.currentDialogue) {
            let { dialogue, person, backgroundObjects } = this.engine.currentDialogue;
            this.dialogue = dialogue;
            this.person = person;
            this.objects = backgroundObjects;
            this.portrait = this.sprites[person.kind];
            this.director = new DialogManager(this.dialogue);
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
        if (this.director) {
            let now = new Date().getTime();
            let elapsed = now - this.lastSelectedAt;
            if (elapsed > 600) {
                if (input.numOne) {
                    console.log("ONE")
                    this.director.selectOption(0);
                    this.lastSelectedAt = now;
                } else if (input.numTwo) {
                    console.log("TWO")
                    this.director.selectOption(1);
                    this.lastSelectedAt = now;
                }
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        let [w, h] = [
            this.engine.canvasWidth,
            this.engine.canvasHeight
        ]
        let sz = 64, scale = 5
        if (this.objects.length) {
            let len = this.objects.length;
            this.objects.forEach((object, i) => {
                // let object = this.backgroundObjects[0]
                object.scale = new Vector(scale, scale)
                object.draw(ctx, ((i + 1) * ((w) / (len + 1))) - (scale * sz), h / 2 - (scale * sz))
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

        if (this.dialogue && this.person && this.director) {
            let pad = 28
            let lines = [this.person.name, ...(this.director.currentLines)]
            this.dialogBox(ctx,
                pad,2*h/3 - pad,w - pad*2,h/3-pad,
                lines,
                this.director.currentOptions
            )
        }
    }

    private dialogBox(
        ctx: CanvasRenderingContext2D,
        x: number, y: number, w: number, h: number,
        lines: string[],
        choices: string[],
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
            ctx.fillText(line, ox, oy + i*64, w);
        })

        oy = y+80 + lines.length*64
        choices.forEach((choice,i) => {
            ctx.fillStyle = 'white'
            // if (i==0) {
            //     ctx.font = "44pt Turret Road"
            // } else {
                ctx.font = "44pt Turret Road"
            // }
            ctx.fillText((i+1) + '. ' + choice, ox + 24 + i * w/choices.length, oy, w);
        })
    }
}

export default Talk;