import { Scene, Color, Engine, Input } from "excalibur";
import { SpriteDict } from "./Values/SpriteDict";

export class Title extends Scene {
    constructor(private engine: Engine, private sprites: SpriteDict) {
        super(engine);
    }

    onActivate() {
        this.engine.backgroundColor = Color.Black;
    }

    onPreUpdate() {
        if (this.engine.input.keyboard.isHeld(Input.Keys.Space)) {
            this.engine.goToScene('wander')
        }
    }

    draw(ctx: CanvasRenderingContext2D, delta: number) {
        let width = this.engine.canvasWidth;
        let height = this.engine.canvasHeight;
        this.sprites.desertImage.draw(ctx, width/2-1440/2,height/2-900/2);

        ctx.font = '100pt Advent Pro';
        ctx.fillStyle = Color.White.toRGBA()
        let textLength = ctx.measureText("NOMOS").width
        ctx.fillText("NOMOS", width / 2 - textLength / 2, height / 2, 1000);

        ctx.font = '48pt Geo';
        ctx.fillStyle = 'rgba(255,255,255,0.8)'
        textLength = ctx.measureText("press space to continue").width
        ctx.fillText("press space to continue", width / 2 - textLength / 2, 3 * height / 4, 1000);
    }
}
