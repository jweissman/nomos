import { Color, Actor, Vector, Engine } from "excalibur";
import GridView from "./GridView";
import World, { Item, Creature, Enemy, Quest } from "../Models/World";
import Point from "../Values/Point";
import { SpriteSheets } from "../Resources";
import { TheniaEnemy } from "../Models/Thenia/TheniaEnemy";
import { assertNever } from "../../util/assertNever";


type PlayerAttack = 'melee-fast' | 'melee-heavy'
const attackRange: (atk: PlayerAttack) => number = (a: PlayerAttack) => {
    let range = -1;
    switch(a) {
        case 'melee-fast': range = 45; break;
        case 'melee-heavy': range = 76; break;
        default: assertNever(a);
    }
    return range;
}

const attackTimeout: (atk: PlayerAttack) => number = (a: PlayerAttack) => {
    let timeout = 1000;
    switch(a) {
        case 'melee-fast': timeout = 140; break;
        case 'melee-heavy': timeout = 450; break;
        default: assertNever(a);
    }
    return timeout;
}

export class PlayerView<E extends Enemy, I extends Item, C extends Creature>
    extends Actor
{
    static speed: number = 2.5;
    static scanRadius: number = 128;
    static shortMeleeAttackTimeout: number = 210
    static longMeleeAttackTimeout: number = 400
    attacking: boolean = false;
    lastAttacked: number = 0;
    lastAttackType: PlayerAttack = 'melee-fast';
    facing: Vector;
    viewing: E | I | C | null = null;
    viewingAt: Point | null = null;

    quests: Quest[] = []

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
        let rebuke = SpriteSheets.Wandering.getSprite(5);
        let swing = SpriteSheets.Wandering.getSprite(8);
        let swingReady = SpriteSheets.Wandering.getSprite(7);
        this.addDrawing('idle', idle);
        this.addDrawing('walk', walk);
        this.addDrawing('walk-slow', slowWalk);
        this.addDrawing('walk-fast', fastWalk);
        this.addDrawing('strike', closeStrikeOne);
        this.addDrawing('strikeTwo', closeStrikeTwo);
        this.addDrawing('strikeThree', rebuke);
        this.addDrawing('swing', swing);
        this.addDrawing('swing-ready', swingReady);
    }

    onPreUpdate() {
        let scan: [E | I | C, Point] | null = this.world.scan([this.pos.x, this.pos.y], PlayerView.scanRadius);
        if (scan) {
            let [it, at] = scan;
            this.viewing = it;
            this.viewingAt = at;
        } else {
            this.viewing = null;
            this.viewingAt = null;
        }

        let now = new Date().getTime();
        let elapsed = now - this.lastAttacked;
        if (this.attacking) {
            let timeout  = attackTimeout(this.lastAttackType)
            if (elapsed > timeout/2) {
                this.setDrawing('idle')
            }

            if (elapsed > timeout) {
                this.attacking = false;
            }
        }
    }

    tryHit(type: PlayerAttack) {
        let frameSize = 3;
        let range = attackRange(type);
        let sz = GridView.cellSize;
        let { x, y } = this.pos
        x /= sz;
        y /= sz;
        let frame: [Point, Point] = [
            [x - frameSize, y - frameSize], [x + frameSize, y + frameSize]
        ]
        let enemies = this.world.map.findEnemies(...frame)
        if (enemies.length) {
            let hit: TheniaEnemy[] = [];
            enemies.forEach(({ it: enemy, position }) => {
                if (enemy.state.hp > 0) {
                    let halfStep = new Vector(sz / 2, sz / 2)
                    let [vx, vy] = position;
                    let v = new Vector(vx * sz, vy * sz);
                    let o = this.pos.sub(halfStep)
                    let dist = v.distance(this.pos.sub(halfStep));
                    let vDist = Math.abs(v.y - o.y)
                    if (dist < range && vDist < range - 10) {
                        hit.push(enemy)
                    }
                }
            })
            if (type === 'melee-heavy') {
                hit.forEach(e => this.world.attack(e, 'heavy') )
            } else {
                if (hit.length) {
                    this.world.attack(hit[0], 'light')
                }
            }
        }
    }

    get mayAttack(): boolean {
        let now = new Date().getTime();
        let elapsed = now - this.lastAttacked;
        return elapsed > attackTimeout(this.lastAttackType);
    }

    // could return back list of enemies struck if any??
    // i guess we don't necessarily know NOW
    attack(type: PlayerAttack) {
        let now = new Date().getTime();
        if (!this.attacking && this.mayAttack) {
            this.attacking = true;
            let longAttack = type === 'melee-heavy';
            if (longAttack) {
                this.setDrawing('swing-ready')
                setTimeout(() => {
                    this.setDrawing('swing')
                    this.tryHit(type)
                    this.attacking = true;
                }, 140)
            } else {
                if (Math.random() < 0.5) {
                    this.setDrawing(Math.random() > 0.6 ? 'strikeTwo' : 'strike')
                } else {
                    this.setDrawing('strikeThree')
                }
            }
            this.lastAttackType = type
            this.lastAttacked = now;
            if (!longAttack) {
                this.tryHit(type)
            }
        }
        return null
    }

    move(vector: Vector, factor: number = 1): void {
        if (vector.magnitude() > 1) {
            vector = vector.normalize()
        }
        vector.scaleEqual(PlayerView.speed * factor);
        let sz = GridView.cellSize;
        if (this.viewingAt && this.viewing instanceof TheniaEnemy) {
            let [x, y] = this.viewingAt
            let halfStep = new Vector(sz / 2, sz / 2)
            let origin = this.pos
            let object = (new Vector(x * sz, y * sz)).add(halfStep)
            let viewAngle = object.sub(origin).normalize()
            this.facing = viewAngle
        }
        if (vector.magnitude() > 0.2) {
            let moved = false;
            if (this.canMove(vector)) {
                this.pos.addEqual(vector);
                moved = true;
            }
            if (!this.attacking) {
                let drawing = 'idle';
                if (moved) {
                    if (vector.magnitude() > 0.2) {
                        drawing = 'walk-slow';
                    }
                    if (vector.magnitude() > 1 * PlayerView.speed / 5) {
                        drawing = 'walk';
                    }
                    if (vector.magnitude() > PlayerView.speed * 1.1) {
                        drawing = 'walk-fast';
                    }
                    if (drawing !== 'idle' && !this.viewingAt) {
                        this.facing = vector;
                    }
                }
                this.setDrawing(drawing);
            }
        } else {
            if (!this.attacking) {
                this.setDrawing('idle');
            }
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
        let blocked = this.world.map.isBlocked([position.x / sz, (position.y+32)/sz], 1, true);
        return !blocked;
    }
}