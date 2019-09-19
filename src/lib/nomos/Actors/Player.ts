import { Color, Actor, Vector, Engine } from "excalibur";
import GridView from "./GridView";
import { World, Item, Creature } from "../Models/World";
import Point from "../Values/Point";
import { SpriteSheets } from "../Resources";

export class Player<I extends Item, C extends Creature> extends Actor {
    static speed: number = 2.5;
    static scanRadius: number = 128;
    facing: Vector;
    viewing: I | C | null = null;
    viewingAt: Point | null = null;

    constructor(engine: Engine, private world: World<any,I,any,any>) {
        super(0, 0, 6, 18, Color.White);
        this.facing = new Vector(0,0)
        let [width,height] = world.dimensions;
        let ox = width/2 * GridView.cellSize;
        let oy = height/2 * GridView.cellSize;
        this.pos = new Vector(ox,oy);

        let idle = SpriteSheets.Wandering.getSprite(0);
        let walk = SpriteSheets.Wandering.getAnimationBetween(engine,0,2,250);
        let slowWalk = SpriteSheets.Wandering.getAnimationBetween(engine,0,2,350);
        let fastWalk = SpriteSheets.Wandering.getAnimationBetween(engine,0,2,180);
        let strike = SpriteSheets.Wandering.getSprite(3);
        this.addDrawing('idle', idle);
        this.addDrawing('walk', walk);
        this.addDrawing('walk-slow', slowWalk);
        this.addDrawing('walk-fast', fastWalk);
        this.addDrawing('strike', strike);
    }

    onPreUpdate() {
        let scan: [I | C, Point] | null = this.world.scan([this.pos.x, this.pos.y], Player.scanRadius);
        if (scan) {
            let [it, at] = scan;
            this.viewing = it;
            this.viewingAt = at;
        } else {
            this.viewing = null;
            this.viewingAt = null;
        }
    }

    attacking: boolean = false;
    attackTimeoutCleared: boolean = true;
    attack(): void {
        if (!this.attacking && this.attackTimeoutCleared) {
            this.setDrawing('strike')
            this.attacking = true;
            this.attackTimeoutCleared = false;
            setTimeout(() => {
                this.attacking = false;
                this.setDrawing('idle')
            }, 135);
            setTimeout(() => this.attackTimeoutCleared = true, 200);
        } else {
            console.warn('already attacking')
        }
    }

    move(vector: Vector, factor: number = 1): void {
        if (!this.attacking) {
            if (vector.magnitude() > 1) {
                vector = vector.normalize()
            }
            vector.scaleEqual(Player.speed * factor);
            this.facing = vector;
            let drawing = 'idle';
            if (vector.magnitude() > 0.2) {
                if (this.canMove(vector)) {
                    this.pos.addEqual(vector);
                }
                drawing = 'walk-slow';
            }
            if (vector.magnitude() > 1 * Player.speed / 5) {
                drawing = 'walk';
            }
            if (vector.magnitude() > Player.speed * 1.1) {
                drawing = 'walk-fast';
            }
            this.setDrawing(drawing);
        }
    }

    onPreDraw() {
        let facingRight = this.facing.x > 0;
        //@ts-ignore
        if (this.currentDrawing.sprites) {
            //@ts-ignore
            this.currentDrawing.sprites.forEach(sprite => sprite.flipHorizontal = facingRight)
        } else {
            this.currentDrawing.flipHorizontal = facingRight;
        }
    }

    private canMove(vector: Vector) {
        let position = this.pos.clone().add(vector.clone());
        let blocked = this.world.isBlocked([position.x, position.y]);
        return !blocked;
    }
}
