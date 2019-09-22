import { Enemy } from "../World";
type Activity = 'idle' | 'ready' | 'guard'
export class TheniaEnemy implements Enemy {
    state: { hp: number, activity: Activity } = { hp: -1, activity: 'idle' };
    isNothing = false;
    static none(): TheniaEnemy {
        let nullEnemy = new TheniaEnemy('nothing', 'not a enemy', 'nothing incarnate');
        nullEnemy.isNothing = true;
        return nullEnemy;
    }
    static bandit(): TheniaEnemy {
        return new TheniaEnemy('bandit', 'a bad dude', 'homo sap', 100, 8, 8);
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
        this.state.hp -= damage
        this.state.activity = 'guard'
        // this.state.gotHit = true
    }
}
