import { Enemy } from "../World";
export class TheniaEnemy implements Enemy {
    state = {};
    isNothing = false;
    static none(): TheniaEnemy {
        let nullEnemy = new TheniaEnemy('nothing', 'not a enemy', 'nothing incarnate');
        nullEnemy.isNothing = true;
        return nullEnemy;
    }
    static bandit(): TheniaEnemy {
        return new TheniaEnemy('bandit', 'a bad dude', 'homo sap', 10, 8, 3);
    }
    constructor(public name: string, public description: string, public species: string, public hp: number = 1, public attackPower: number = 1, public defense: number = 1) {
    }
    get kind() { return this.name; }
}
