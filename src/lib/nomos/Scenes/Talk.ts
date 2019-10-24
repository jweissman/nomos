import { canvasExtensions } from "../Extends/Canvas"
import { Scene, Drawable, Vector } from "excalibur";
import { Person } from "../../ea/World";
import Dialogue from "../../ea/Dialogue";
import { SpriteDict } from "../Values/SpriteDict";
import { GameController, InputState } from "../GameController";
import Game from "../Game";
import { DialogManager } from "./DialogManager";

const noop = (_args: any) => {}
noop(canvasExtensions);

class Talk extends Scene {
    dialogue: Dialogue | undefined;
    person: Person | undefined;
    objects: Drawable[] = [];
    director: DialogManager | undefined;
    controller: GameController;
    portrait: Drawable | undefined;
    lastSelectedAt: number = -1;
    lastClickedAt: number = -1;

    constructor(private engine: Game, private sprites: SpriteDict) {
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
            this.engine.goToScene(lastScene)
        }
        if (this.director) {
            let now = new Date().getTime();
            let clickElapsed = now - this.lastClickedAt;
            if (clickElapsed > 240) {
                if (input.dx > 0.2) {
                    this.director.clickRight()
                    this.lastClickedAt = now;
                } else if (input.dx < -0.2) {
                    this.director.clickLeft()
                    this.lastClickedAt = now;
                }
            }


            let selectElapsed = now - this.lastSelectedAt;
            if (selectElapsed > 400) {
                if (input.yes) {
                    this.director.selectOption(this.director.state.hoveredIndex);
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
            let choices = this.director.currentOptions;
            let hover = this.director.state.hoveredIndex;
            let lines = [
                this.person.name,
                ...(this.director.currentLines),
                choices.map((choice,index) =>
                    `${hover === index && '>' || ''} ${index + 1}. ${choice}`
                ).join(' ')
            ]
            this.engine.graphics.dialogBox(ctx, lines)
        }
    }
}

export default Talk;