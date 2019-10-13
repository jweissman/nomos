import { Game } from "./Game";
export class Graphics {
    constructor(private game: Game) { }
    dialogBox(ctx: CanvasRenderingContext2D, lines: string[]) {
        let width = this.game.canvasWidth;
        let height = this.game.canvasHeight;
        let pad = 28;
        let [x, y, w, h] = [pad, 2 * height / 3 - pad - 64, width - pad * 2, height / 3 + 64 - pad/2,];
        ctx.fillStyle = 'black';
        ctx.roundRect(x, y, w, h, 10).fill();
        let borderThickness = 0.5;
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 8;
        let r = borderThickness;
        ctx.roundRect(x - r, y - r, w + 2 * r, h + 2 * r, 10).stroke();
        ctx.lineWidth = 0.6;
        let [ox, oy] = [x + 32, y + 80];
        lines.forEach((line, i) => {
            ctx.fillStyle = 'white';
            if (i == 0) {
                ctx.font = `bold 44pt ${Game.fonts.ui}`;
            }
            else {
                ctx.font = `44pt ${Game.fonts.ui}`;
            }
            ctx.fillText(line, ox, oy + i * 64, w);
        });
    }
}
