import { Color, Actor, Vector } from "excalibur";
import GridView from "./GridView";
import { World, Item, Creature } from "../Models/World";
import Point from "../Values/Point";

export class Player<I extends Item, C extends Creature> extends Actor {
    static speed: number = 3.5;
    static scanRadius: number = 128;
    facing: Vector;
    viewing: I | C | null = null;
    viewingAt: Point | null = null;

    constructor(private world: World<any,I,any,any>) {
        super(0, 0, 6, 18, Color.White);
        this.facing = new Vector(0,0)
        let [width,height] = world.dimensions;
        let ox = width/2 * GridView.cellSize;
        let oy = height/2 * GridView.cellSize;
        console.log("player pos" + [ox,oy])
        this.pos = new Vector(ox,oy);
    }


    onPreUpdate() {
        if (this.facing.x > 0) {
            this.currentDrawing.flipHorizontal = true;
        } else {
            this.currentDrawing.flipHorizontal = false;
        }

        let scan: [I | C, Point] | null = this.world.scan([this.pos.x, this.pos.y], Player.scanRadius);
        if (scan) { //} && !scan[0].state.collected) {
            let [it, at] = scan;
            // console.log("scan", it,at)
            this.viewing = it;
            this.viewingAt = at;
                // console.log("I SEE " + this.viewing.kind + " AT " + this.viewingAt);
        } else {
            this.viewing = null;
            this.viewingAt = null;
        }

        // if (this.viewing && !!this.viewing.state.collected) {
        //     this.viewing = null;
        //     this.viewingAt = null;
        // }
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
