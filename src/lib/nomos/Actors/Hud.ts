import { Engine, Scene, Vector } from "excalibur";
import { Header, Subheader, Log } from "./UI";
import Point from "../Values/Point";
import GridView from "./GridView";
import { QuestArrowsView, Arrow } from "./QuestArrowsView";

export class Hud {
    title: Header;
    subtitle: Subheader;
    log: Log;
    arrowView: QuestArrowsView;
    namedArrows: { [name: string]: Arrow } = {};
    
    constructor(engine: Engine, private scene: Scene) {
        this.title = new Header("Nemian Desert", engine);
        this.subtitle = new Subheader("", engine);
        this.log = new Log("Welcome to the Desert", engine);
        this.arrowView = new QuestArrowsView(engine)
    }

    setup() {
        this.scene.add(this.title);
        this.scene.add(this.subtitle);
        this.scene.add(this.log);
        this.scene.add(this.arrowView);
    }

    pointTo(name: string, location: Point, player: Point, frame: [Point,Point]) {
        let sz = GridView.cellSize;
        let [px,py] = player;
        let playerPos = new Vector(px/sz,py/sz)
        let goalPos = new Vector(...location)
        let [[fx,fy],[fex,fey]] = frame;
        let [gx,gy] = [ goalPos.x, goalPos.y]
        let inFrame = fx < gx && gx < fex && fy < gy && gy < fey;
        let direction: Vector = playerPos.sub(goalPos).normalize()
        let distance: number = playerPos.distance(goalPos)
        this.namedArrows[name] = { target: [goalPos.x,goalPos.y], direction, distance, inFrame };
        this.arrowView.updateArrows(this.namedArrows);
        this.arrowView.updatePlayerLocation(player);
    }

    clearPointer(name: string) {
        delete this.namedArrows[name]
        this.arrowView.removeArrow(name);
    }
}
