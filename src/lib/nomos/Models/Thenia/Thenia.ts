import Point from "../../Values/Point";
import GridView from "../../Actors/GridView";
import { CombatResult } from "../../../ea/World";
import { TheniaDoodad } from "./TheniaDoodad";
import { TheniaTerrain } from "./TheniaTerrain";
import { TheniaCreature } from "./TheniaCreature";
import { TheniaEnemy } from "./TheniaEnemy";
import { TheniaItem } from "./TheniaItem";
import distance from "../../../util/distance";
import { EnemyController } from "./EnemyController";
import nemianKinds from "../Nemea/NemianEntityKinds";
import Ea from "../../../ea/Ea";
import CreatureController from "./CreatureController";
import { TheniaPerson } from "./TheniaPerson";

export const theniaExtent = 2048
export class TheniaEngine extends Ea<TheniaEnemy, TheniaCreature, TheniaItem, TheniaDoodad, TheniaTerrain, TheniaPerson> {
    critterSpeed: number = 0.011
    enemySpeed: number = 0.002
    private riding: TheniaCreature | null = null
    private enemyController: EnemyController = new EnemyController(this);
    private creatureController: CreatureController = new CreatureController(this);

    constructor(public dimensions: Point = [theniaExtent,theniaExtent]) { 
        super(dimensions, nemianKinds);
    }

    updateCreature(creature: TheniaCreature) {
        this.creatureController.update(creature);
    }

    updateEnemy(enemy: TheniaEnemy): void {
        this.enemyController.update(enemy);
    }

    scan(origin: [number, number], radius: number): [TheniaEnemy | TheniaItem | TheniaCreature, Point] | null {
        let sz = GridView.cellSize;
        let matches: [TheniaItem | TheniaCreature | TheniaEnemy, Point][] = [];
        let [ox, oy] = origin;
        let frame: Point[] = [
            [ox / sz - radius / sz, oy / sz - radius / sz],
            [ox / sz + radius / sz, oy / sz + radius / sz],
        ];
        this.map.findItems(frame[0], frame[1]).forEach(({ it: item, position }) => {
            if (!item.state.collected) {
                let [x, y] = position;
                let [ix, iy] = [x * sz, y * sz];
                if (distance([ox, oy], [ix, iy]) < radius) {
                    matches.push([item, position])
                }
            }
        })

        this.map.findCreatures(frame[0], frame[1]).forEach(({ it: creature, position }) => {
            if (creature.hops) {
                matches.push([creature, [position[0], position[1] - 0.6]])
            } else {
                matches.push([creature, [position[0] - 0.5, position[1] - 0.5]])
            }
        })
        this.map.findEnemies(frame[0], frame[1]).forEach(({ it: enemy, position }) => {
            if (!enemy.dead) {
                matches.push([enemy, [position[0], position[1]]])
            }
        })
        let o: Point = [ox / sz - 0.5, oy / sz - 0.5];

        matches.sort((a, b) => distance(o, a[1]) > distance(o, b[1]) ? 1 : -1)
        return matches[0];
    }

    ride(it: TheniaCreature) {
        it.state.visible = false;
        this.riding = it;
    }

    dismount() {
        if (this.riding) {
            this.riding.state.visible = true;
            let [x,y] = this.player.location
            let sz = GridView.cellSize;
            this.map.setCreaturePosition(this.riding, [x/sz,y/sz])
            this.riding = null;
        }
    }

    attack(enemy: TheniaEnemy, attackStrength: 'light' | 'heavy'): CombatResult {
        let playerAttackRating = 100 + attackStrength === 'light' ? 50 : 250;
        let result: CombatResult = { damaged: false }
        if (playerAttackRating > enemy.defense) {
            let damage = playerAttackRating - enemy.defense;
            result = { damage, damaged: true }
        }

        if (result.damage) {
            enemy.getHit(result.damage, attackStrength)
        }
        return result;
    }

    
}

export default TheniaEngine;