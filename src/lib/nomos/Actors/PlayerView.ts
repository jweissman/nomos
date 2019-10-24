import { Actor, Color, Engine, Vector } from "excalibur";
import World, { Creature, Enemy, Item } from "../../ea/World";
import { assertNever } from "../../util/assertNever";
import { TheniaEnemy } from "../Models/Thenia/TheniaEnemy";
import { SpriteSheets } from "../Resources";
import Point from "../Values/Point";
import GridView from "./GridView";
import { Quest } from "../../ea/Values";

type PlayerAttack = "melee-fast" | "melee-heavy";
const attackRange: (atk: PlayerAttack) => number = (a: PlayerAttack) => {
    let range = -1;
    switch (a) {
        case "melee-fast": range = 45; break;
        case "melee-heavy": range = 76; break;
        default: assertNever(a);
    }
    return range;
};

const attackTimeout: (atk: PlayerAttack) => number = (a: PlayerAttack) => {
    let timeout = 1000;
    switch (a) {
        case "melee-fast": timeout = 140; break;
        case "melee-heavy": timeout = 450; break;
        default: assertNever(a);
    }
    return timeout;
};

export class PlayerView<E extends Enemy, I extends Item, C extends Creature>
    extends Actor {
    public static speed: number = 2.5;
    public static scanRadius: number = 128;
    public static shortMeleeAttackTimeout: number = 210;
    public static longMeleeAttackTimeout: number = 400;
    public attacking: boolean = false;
    public lastAttacked: number = 0;
    public lastAttackType: PlayerAttack = "melee-fast";
    public facing: Vector;
    public viewing: E | I | C | null = null;
    public viewingAt: Point | null = null;

    public quests: Quest[] = [];

    constructor(engine: Engine, private world: World<any, any, I, any, any, any>) {
        super(0, 0, 6, 18, Color.White);
        this.facing = new Vector(0, 0);
        const idle = SpriteSheets.Wandering.getSprite(0);
        const walk = SpriteSheets.Wandering.getAnimationBetween(engine, 0, 2, 250);
        const slowWalk = SpriteSheets.Wandering.getAnimationBetween(engine, 0, 2, 350);
        const fastWalk = SpriteSheets.Wandering.getAnimationBetween(engine, 0, 2, 180);
        const closeStrikeOne = SpriteSheets.Wandering.getSprite(3);
        const closeStrikeTwo = SpriteSheets.Wandering.getSprite(4);
        const rebuke = SpriteSheets.Wandering.getSprite(5);
        const swing = SpriteSheets.Wandering.getSprite(8);
        const swingReady = SpriteSheets.Wandering.getSprite(7);
        this.addDrawing("idle", idle);
        this.addDrawing("walk", walk);
        this.addDrawing("walk-slow", slowWalk);
        this.addDrawing("walk-fast", fastWalk);
        this.addDrawing("strike", closeStrikeOne);
        this.addDrawing("strikeTwo", closeStrikeTwo);
        this.addDrawing("strikeThree", rebuke);
        this.addDrawing("swing", swing);
        this.addDrawing("swing-ready", swingReady);
    }

    public onPreUpdate() {
        const scan: [E | I | C, Point] | null = this.world.scan([this.pos.x, this.pos.y], PlayerView.scanRadius);
        if (scan) {
            const [it, at] = scan;
            this.viewing = it;
            this.viewingAt = at;
        } else {
            this.viewing = null;
            this.viewingAt = null;
        }

        const now = new Date().getTime();
        const elapsed = now - this.lastAttacked;
        if (this.attacking) {
            const timeout  = attackTimeout(this.lastAttackType);
            if (elapsed > timeout / 2) {
                this.setDrawing("idle");
            }

            if (elapsed > timeout) {
                this.attacking = false;
            }
        }
    }

    public tryHit(type: PlayerAttack) {
        const frameSize = 3;
        const range = attackRange(type);
        const sz = GridView.cellSize;
        let { x, y } = this.pos;
        x /= sz;
        y /= sz;
        const frame: [Point, Point] = [
            [x - frameSize, y - frameSize], [x + frameSize, y + frameSize],
        ];
        const enemies = this.world.map.findEnemies(...frame);
        if (enemies.length) {
            const hit: TheniaEnemy[] = [];
            enemies.forEach(({ it: enemy, position }) => {
                if (enemy.state.hp > 0) {
                    const halfStep = new Vector(sz / 2, sz / 2);
                    const [vx, vy] = position;
                    const v = new Vector(vx * sz, vy * sz);
                    const o = this.pos.sub(halfStep);
                    const dist = v.distance(this.pos.sub(halfStep));
                    const vDist = Math.abs(v.y - o.y);
                    if (dist < range && vDist < range - 10) {
                        hit.push(enemy);
                    }
                }
            });
            if (type === "melee-heavy") {
                hit.forEach((e) => this.world.attack(e, "heavy") );
            } else {
                if (hit.length) {
                    this.world.attack(hit[0], "light");
                }
            }
        }
    }

    get mayAttack(): boolean {
        const now = new Date().getTime();
        const elapsed = now - this.lastAttacked;
        return elapsed > attackTimeout(this.lastAttackType);
    }

    public attack(type: PlayerAttack) {
        const now = new Date().getTime();
        if (!this.attacking && this.mayAttack) {
            this.attacking = true;
            const longAttack = type === "melee-heavy";
            if (longAttack) {
                this.setDrawing("swing-ready");
                setTimeout(() => {
                    this.setDrawing("swing");
                    this.tryHit(type);
                    this.attacking = true;
                }, 140);
            } else {
                if (Math.random() < 0.5) {
                    this.setDrawing(Math.random() > 0.6 ? "strikeTwo" : "strike");
                } else {
                    this.setDrawing("strikeThree");
                }
            }
            this.lastAttackType = type;
            this.lastAttacked = now;
            if (!longAttack) {
                this.tryHit(type);
            }
        }
        return null;
    }

    public move(vector: Vector, factor: number = 1): void {
        if (vector.magnitude() > 1) {
            vector = vector.normalize();
        }
        vector.scaleEqual(PlayerView.speed * factor);
        const sz = GridView.cellSize;
        if (this.viewingAt) {
            if (this.viewing instanceof TheniaEnemy) {
                const [x, y] = this.viewingAt;
                const halfStep = new Vector(sz / 2, sz / 2);
                const origin = this.pos;
                const object = (new Vector(x * sz, y * sz)).add(halfStep);
                const viewAngle = object.sub(origin).normalize();
                this.facing = viewAngle;
            }

        }
        if (vector.magnitude() > 0.2) {
            let moved = false;
            if (this.canMove(vector)) {
                this.pos.addEqual(vector);
                moved = true;
            }
            if (!this.attacking) {
                let drawing = "idle";
                if (moved) {
                    if (vector.magnitude() > 0.2) {
                        drawing = "walk-slow";
                    }
                    if (vector.magnitude() > 1 * PlayerView.speed / 5) {
                        drawing = "walk";
                    }
                    if (vector.magnitude() > PlayerView.speed * 1.1) {
                        drawing = "walk-fast";
                    }
                    if (drawing !== "idle" && !this.viewingAt) {
                        this.facing = vector;
                    }
                }
                this.setDrawing(drawing);
            }
        } else {
            if (!this.attacking) {
                this.setDrawing("idle");
            }
        }
    }

    public onPreDraw() {
        const facingRight = this.facing.x > 0;
        // @ts-ignore
        if (this.currentDrawing.sprites) {
            // @ts-ignore
            this.currentDrawing.sprites.forEach((sprite) => sprite.flipHorizontal = facingRight);
        } else {
            this.currentDrawing.flipHorizontal = facingRight;
        }
    }

    private canMove(vector: Vector) {
        const position = this.pos.clone().add(vector.clone());
        const sz = GridView.cellSize;
        const blocked = this.world.map.isBlocked([position.x / sz, (position.y + 32) / sz], 1, true);
        return !blocked;
    }
}
