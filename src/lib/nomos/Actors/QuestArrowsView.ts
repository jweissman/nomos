import { Vector, Actor, Color, UIActor, Label, Engine } from "excalibur";
import Point from "../Values/Point";
import GridView from "./GridView";
import Game from "../Game";

export type Arrow = { target: Point, direction: Vector, distance: number, inFrame: boolean }
class ArrowHead extends Actor {
    draw(ctx: CanvasRenderingContext2D) {
        let {x,y} = this.pos;
        let r = 5;
        ctx.fillStyle = 'yellow'
        ctx.beginPath();
        ctx.moveTo(x,y);
        ctx.lineTo(x-r,y+r);
        ctx.lineTo(x-r,y-r);
        ctx.fill();
    }
}
class ArrowView extends Actor {
    constructor() {
        super(0, 0, 20, 3, Color.Yellow)
        this.add(new ArrowHead(14,0,10,10, Color.Yellow));
    }
    // draw...
}

export class QuestArrowsView extends UIActor {
    playerLocation: Point = [-1,-1]
    arrowModel: { [name: string]: Arrow } = {};
    labels: { [name: string]: Label } = {}
    arrows: { [name: string]: ArrowView } = {}
    constructor(protected engine: Engine) {
        super();
    }

    getArrowPosition(arrow: Arrow): Point {
        let sz = GridView.cellSize;
        let radius = sz * 3;
        if (arrow.inFrame) {
            radius = 1.5 * sz * (arrow.distance / 4);
            
        }

        let pos = new Vector(this.engine.canvasWidth / 2, this.engine.canvasHeight / 2);
        let delta = arrow.direction.scale(radius).rotate(Math.PI);
        return [pos.x + delta.x + 64, pos.y + delta.y + 64];
    }

    arrowAngle(name: string) {
        return this.arrowModel[name].direction.toAngle()+ Math.PI
    }

    updatePlayerLocation(playerLocation: Point) {
        this.playerLocation = playerLocation;
    }

    private describeDistance(meters: number) {
        if (meters > 10000) {
            return `${Math.floor(meters/1000)}km`
        } else {
            return `${Math.floor(meters)}m`
        }
    }

    arrowNames() { return Object.keys(this.arrowModel); }

    updateArrows(namedArrows: { [name: string]: Arrow; }) {
        this.arrowModel = namedArrows;
        for (let name of Object.keys(this.arrowModel)) {
            let arrow = this.arrowModel[name]
            let theLabel = this.findOrCreateLabel(name);
            let pos = this.getArrowPosition(arrow)
            let [px,py] = pos;

            theLabel.text = `${name} (${this.describeDistance(arrow.distance)})`
            theLabel.pos = new Vector(px + 24, py + 10)
            let arrowView = this.findOrCreateArrow(name);
            arrowView.pos = new Vector(...pos)
            arrowView.rotation = this.arrowAngle(name);
        }
    }

    removeArrow(name: string) {
        this.remove(this.labels[name])
        this.remove(this.arrows[name])
        delete this.arrowModel[name]
    }

    findOrCreateLabel(name: string): Label {
        let matching = this.labels[name];
        if (matching) {
            return matching;
        }
        return this.createLabel(name);
    }

    createLabel(name: string): Label {
        let label = new Label(name); 
        label.fontFamily = Game.fonts.secondary;
        label.fontSize = 18
        label.color = Color.White;
        this.add(label)
        this.labels[name] = label
        return label
    }

    findOrCreateArrow(name: string): ArrowView {
        let matching = this.arrows[name];
        if (matching) {
            return matching;
        }
        return this.createArrow(name);
    }
    createArrow(name: string): ArrowView {
        let arrow = new ArrowView();
        arrow.pos = this.findOrCreateLabel(name).pos;
        arrow.rotation = this.arrowAngle(name);
        this.add(arrow)
        this.arrows[name] = arrow
        return arrow
    }
}

