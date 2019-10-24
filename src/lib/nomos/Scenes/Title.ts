import { Color, Engine, Scene } from "excalibur";
import { GameController } from "../GameController";
import species from "../Typography";
import { SpriteDict } from "../Values/SpriteDict";

export class Title extends Scene {
    private input: GameController;

    constructor(private engine: Engine, private sprites: SpriteDict) {
        super(engine);
        this.input = new GameController(engine);
    }

    public onActivate() {
        this.engine.backgroundColor = Color.Black;
    }

    public onPreUpdate() {
        if (this.input.state().start) {
            this.engine.goToScene("wander");
        }
    }

    public draw(ctx: CanvasRenderingContext2D, delta: number) {
        const width = this.engine.canvasWidth;
        const height = this.engine.canvasHeight;
        this.sprites.desertImage.draw(ctx, width / 2 - 1440 / 2, height / 2 - 900 / 2);

        ctx.font = `100pt ${species.advent}`;
        ctx.fillStyle = Color.White.toRGBA();
        let textLength = ctx.measureText("NOMOS").width;
        ctx.fillText("NOMOS", width / 2 - textLength / 2, height / 2, 1000);

        ctx.font = `48pt ${species.geo}`;
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        const message = "press ENTER to continue";
        textLength = ctx.measureText(message).width;
        ctx.fillText(message, width / 2 - textLength / 2, 3 * height / 4, 1000);
    }
}
