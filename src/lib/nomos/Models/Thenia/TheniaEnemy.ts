import { Enemy } from "../World";
import Point from "../../Values/Point";
import { Vector } from "excalibur";

export type Activity = 'idle'
                     | 'ready'
                     | 'guard'
                     | 'alert'
                     | 'walk'
                     | 'search'
                     | 'alert-walk'
                     | 'attack'

type EnemyState = {
    hp: number
    activity: Activity
    alert: boolean
    dead: boolean
    walkingTo: Point | null
    gotHit: boolean
    attacking: boolean
    facing: Vector
}

export class TheniaEnemy implements Enemy {
    attackTimeout: number = 200
    lastGotHitAt: number = 0;
    lastAttackedAt: number = 0;
    speed: number = 0.035
    state: EnemyState = {
        hp: -1,
        activity: 'idle',
        alert: false,
        dead: false,
        walkingTo: null,
        gotHit: false,
        attacking: false,
        facing: new Vector(0,0),
    };
    isNothing = false;
    static none(): TheniaEnemy {
        let nullEnemy = new TheniaEnemy('nothing', 'not a enemy', 'nothing incarnate');
        nullEnemy.isNothing = true;
        return nullEnemy;
    }
    static bandit(): TheniaEnemy {
        return new TheniaEnemy('bandit', 'a bad dude', 'homo sap', 1000, 8, 8);
    }
    constructor(
        public name: string,
        public description: string,
        public species: string,
        public hp: number = 1,
        public attackPower: number = 1,
        public defense: number = 1) {
        this.state.hp = hp;
    }
    get kind() { return this.dead ? `${this.name}Dead` : this.stateSpriteName; }
    get stateSpriteName() {
        if (this.state.activity !== 'idle') {
            return `${this.name}-${this.state.activity}`
        };
        return this.name;
    }
    get dead() { return this.state.hp <= 0; }

    getHit(damage: number) {
        if (!this.dead) {
            this.state.hp -= damage
            this.state.gotHit = true;
            this.state.attacking = false;
            this.lastGotHitAt = new Date().getTime();
        }
    }

    walk(dest: Point) {
        if (!this.dead) {
            this.state.walkingTo = dest;
        }
    }

    alert(to: Point) {
        this.state.alert = true
        this.walk(to)
    }

    attack() {
        if (!this.state.attacking) {
            this.state.walkingTo = null;
            this.state.attacking = true
            this.lastAttackedAt = new Date().getTime();
            // this.attackTimeoutCleared = false
            // setInterval(() => {
            //     this.state.attacking = false;
            //     this.attackTimeoutCleared = true
            // }, this.attackTimeout)
        } else {
            this.state.activity = 'idle'
        }
    }

    stopWalking() {
        this.state.walkingTo = null;
    }
}
