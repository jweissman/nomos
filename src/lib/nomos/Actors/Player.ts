import { Color, Actor, Vector } from "excalibur";
import GridView from "./GridView";
import { World, Item } from "../Models/World";
import Point from "../Values/Point";

export class Player<I extends Item> extends Actor {
    static speed: number = 2;
    static scanRadius: number = 48;
    facing: Vector;
    viewing: I | null = null;
    viewingAt: Point | null = null;
    // frame: Actor = new Actor(0,0,64,64);

    constructor(private world: World<I,any,any>) {
        super(0, 0, 6, 18, Color.White);
        this.facing = new Vector(0,0)
        let ox =world.dimensions[0]/2 * GridView.cellSize;
        let oy =world.dimensions[1]/2 * GridView.cellSize;
        this.pos = new Vector(ox,oy);
    }


    onPreUpdate() {
        if (this.facing.x > 0) {
            this.currentDrawing.flipHorizontal = true;
        } else {
            this.currentDrawing.flipHorizontal = false;
        }

        let scan: [I, Point] | null = this.world.scan([this.pos.x, this.pos.y], Player.scanRadius);
        if (scan) {
            let [ it, at ] = scan;
            this.viewing = it;
            this.viewingAt = at;
            // console.log("I SEE " + this.viewing.kind + " AT " + this.viewingAt);
        } else {
            this.viewing = null;
            this.viewingAt = null;
        }
    }

    move(vector: Vector): void {
        if (vector.magnitude() > 1) {
            vector = vector.normalize()
        }
        vector.scaleEqual(Player.speed);
        this.facing = vector;
        if (vector.magnitude() > 0.5) {
            if (this.canMove(vector)) {
                this.pos.addEqual(vector);
            } else {
                console.debug("BLOCKED!")
            }
        }
    }

    private canMove(vector: Vector) {
        let position = this.pos.clone().add(vector.clone());
        let blocked = this.world.isBlocked([position.x, position.y]);
        return !blocked;
    }
}
