import { Color, Actor, Vector, Engine } from "excalibur";
import GridView from "./GridView";
import World, { Item, Creature, Enemy } from "../Models/World";
import Point from "../Values/Point";
import { SpriteSheets } from "../Resources";
import { TheniaEnemy } from "../Models/Thenia/TheniaEnemy";

export class Player<E extends Enemy, I extends Item, C extends Creature> extends Actor {
    static speed: number = 2.5;
    static scanRadius: number = 128;
    facing: Vector;
    viewing: E | I | C | null = null;
    viewingAt: Point | null = null;

    constructor(engine: Engine, private world: World<any,any,I,any,any>) {
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
        let closeStrikeOne = SpriteSheets.Wandering.getSprite(3);
        let closeStrikeTwo = SpriteSheets.Wandering.getSprite(4);
        let swing = SpriteSheets.Wandering.getSprite(7); //engine,5,8,150);
        let swingReady = SpriteSheets.Wandering.getSprite(6); //engine,5,8,150);
        this.addDrawing('idle', idle);
        this.addDrawing('walk', walk);
        this.addDrawing('walk-slow', slowWalk);
        this.addDrawing('walk-fast', fastWalk);
        this.addDrawing('strike', closeStrikeOne);
        this.addDrawing('strikeTwo', closeStrikeTwo);
        this.addDrawing('swing', swing);
        this.addDrawing('swing-ready', swingReady);
    }

    onPreUpdate() {
        let scan: [E | I | C, Point] | null = this.world.scan([this.pos.x, this.pos.y], Player.scanRadius);
        if (scan) {
            let [it, at] = scan;
            this.viewing = it;
            this.viewingAt = at;
        } else {
            this.viewing = null;
            this.viewingAt = null;
        }
    }

    tryHit(range: number, maxDistance: number = 3) {
        let sz = GridView.cellSize;
        let {x,y} = this.pos
        x /= sz;
        y /= sz;
        // x += 0.5
        // y += 0.5
        let enemies = this.world.map.findEnemies([x-maxDistance, y-maxDistance],[x+maxDistance, y+maxDistance])
        console.log("TRY HIT", { x, y, enemies: this.world.map.listEnemies(), found: enemies })
        if (enemies.length) {
            enemies.forEach(({ it: enemy, position }) => {
                //this.world.attack(enemy))
                //let sz = GridView.cellSize;
                let halfStep = new Vector(sz / 2, sz / 2)
                let [vx, vy] = position; //this.viewingAt;
                let v = new Vector(vx * sz, vy * sz);
                let o = this.pos.sub(halfStep)
                let dist = v.distance(this.pos.sub(halfStep));
                let vDist = Math.abs(v.y - o.y)
                if (dist < range && vDist < range - 10) {
                    console.log("ATTACK")
                    this.world.attack(enemy)
                    // return result
                } else {
                    console.log("MISS", { dist, range })
                }
            })
        } else {
            console.log("WOULD STRIKE BUT NOT FOCUSED")
        }
    }

    attacking: boolean = false;
    attackTimeoutCleared: boolean = true;
    shortMeleeAttackTimeout: number = 170
    longMeleeAttackTimeout: number = 410
    attack(type: 'melee-slow' | 'melee-fast') {
        if (!this.attacking && this.attackTimeoutCleared) {
            this.attacking = true;
            this.attackTimeoutCleared = false;
            let longAttack = type === 'melee-slow';
            if (longAttack) {
                this.setDrawing('swing-ready')
                setTimeout(() => {
                    this.setDrawing('swing')
                    this.tryHit(76)
                    this.attacking = true;
                }, 200)
            } else {
                this.setDrawing(Math.random() > 0.6 ? 'strikeTwo' : 'strike')
            }

            setTimeout(() => {
                this.attacking = false;
                this.setDrawing('idle')
            }, 100 + (longAttack ? 200 : 0));

            let timeout = this.shortMeleeAttackTimeout + (longAttack ? this.longMeleeAttackTimeout : 0)
            setTimeout(() => this.attackTimeoutCleared = true, timeout);

            if (!longAttack) {
                this.tryHit(45)
            }
       }
        return null
    }

    move(vector: Vector, factor: number = 1): void {
        if (!this.attacking) {
            if (vector.magnitude() > 1) {
                vector = vector.normalize()
            }
            vector.scaleEqual(Player.speed * factor);
            let sz = GridView.cellSize;
            if (this.viewingAt && this.viewing instanceof TheniaEnemy) {
                let [x, y] = this.viewingAt
                let halfStep = new Vector(sz / 2, sz / 2)
                let origin = this.pos
                let object = (new Vector(x * sz, y * sz)).add(halfStep)
                let viewAngle = object.sub(origin).normalize()
                this.facing = viewAngle
            }
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
            if (drawing !== 'idle' && !this.viewingAt) {
                this.facing = vector;
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
        let sz = GridView.cellSize;
        let blocked = this.world.map.isBlocked([position.x/sz, position.y/sz], 1, true);
        return !blocked;
    }
}
