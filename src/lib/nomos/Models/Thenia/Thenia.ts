import Point from "../../Values/Point";
import GridView from "../../Actors/GridView";
import World, { CombatResult, Enemy } from "../World";
import { TheniaDoodad } from "./TheniaDoodad";
import { TheniaTerrain } from "./TheniaTerrain";
import { TheniaCreature } from "./TheniaCreature";
import { TheniaEnemy } from "./TheniaEnemy";
import { TheniaItem } from "./TheniaItem";
import distance from "../../../util/distance";
import { Vector } from "excalibur";
import { Cartogram } from "./Cartogram";

class Thenia extends World<TheniaEnemy, TheniaCreature, TheniaItem, TheniaDoodad, TheniaTerrain> {
    messageLog: string[] = []
    dimensions: Point = [1024,1024]
    critterSpeed: number = 0.011
    private cartogram: Cartogram = new Cartogram(this.dimensions);
    private riding: TheniaCreature | null = null
    private playerPos: Point = [-1,-1]

    get map(): Cartogram { return this.cartogram;}

    updateCreature(creature: TheniaCreature) {
        let [x, y] = this.map.getCreaturePosition(creature);
        let v = creature.state.facing || new Vector(
            1 - (Math.random() * 2),
            1 - (Math.random() * 2),
        )
        v = v.normalize().scale(this.critterSpeed)
        let newPosVec: Vector = new Vector(x, y).add(v)
        let newPos: Point = [newPosVec.x, newPosVec.y]
        if (this.map.isBlocked(newPos)) {
            creature.state.facing = null;
        } else {
            this.map.setCreaturePosition(creature, newPos);
            creature.state = {
                ...creature.state,
                facing: v
            }
        }
    }

    updateEnemy(enemy: TheniaEnemy): void {
        if (enemy.state.activity === 'idle') {
            if (Math.random() < 0.001) {
                enemy.state.activity = 'ready';
            }
        } else if (enemy.state.activity === 'ready') {
            if (Math.random() < 0.002) {
                enemy.state.activity = 'idle';
            }
        }
    }

    scan(origin: [number, number], radius: number): [TheniaEnemy | TheniaItem | TheniaCreature, Point] | null {
        let sz = GridView.cellSize;
        let matches: [TheniaItem | TheniaCreature, Point][] = [];
        let [ox, oy] = origin;
        let frame: Point[] = [
            [ox/sz - radius/sz, oy/sz - radius/sz],
            [ox/sz + radius/sz, oy/sz + radius/sz],
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

        this.map.findCreatures(frame[0], frame[1]) .forEach(({ it: creature, position }) => {
            matches.push([creature, [position[0] - 0.5, position[1] - 0.5]])
        })
        this.map.findEnemies(frame[0], frame[1]).forEach(({ it: enemy, position }) => {
            if (!enemy.dead) {
                matches.push([enemy, [position[0], position[1]]])
            }
        })
        let o: Point = [ox/sz-0.5,oy/sz-0.5];
        
        matches.sort((a,b) => distance(o, a[1]) > distance(o, b[1]) ? 1 : -1)
        return matches[0];
    }

    interact(it: TheniaItem, pos: Point): string {
        let message = it.handleInteraction();
        this.map.updateItemAt(pos, it)
        return message;
    }

    ride(it: TheniaCreature) {
        it.state.visible = false;
        this.riding = it;
    }

    dismount() {
        if (this.riding) {
            this.riding.state.visible = true;
            let [x,y] = this.playerPos
            let sz = GridView.cellSize;
            this.map.setCreaturePosition(this.riding, [x/sz,y/sz])
            this.riding = null;
        }
    }

    setPlayerLocation(pos: Point) {
        this.playerPos = pos
    }

    getPlayerLocation() {
        return this.playerPos
    }

    attack(enemy: TheniaEnemy): CombatResult {
        let playerAttackRating = 100;
        let result: CombatResult = { damaged: false }
        if (playerAttackRating > enemy.defense) {
            let damage = playerAttackRating - enemy.defense;
            result = { damage, damaged: true }
        }

        if (result.damage) {
            enemy.getHit(result.damage)
        }
        return result;
    }
}

export default Thenia;