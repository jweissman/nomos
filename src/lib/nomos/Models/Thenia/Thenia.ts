import Point from "../../Values/Point";
import GridView from "../../Actors/GridView";
import World, { CombatResult, Quest } from "../World";
import { TheniaDoodad } from "./TheniaDoodad";
import { TheniaTerrain } from "./TheniaTerrain";
import { TheniaCreature } from "./TheniaCreature";
import { TheniaEnemy } from "./TheniaEnemy";
import { TheniaItem } from "./TheniaItem";
import distance from "../../../util/distance";
import { Vector } from "excalibur";
import { Cartogram } from "./Cartogram";
import { EnemyController } from "./EnemyController";
import Player from "../Player";
import nemianKinds from "../Nemea/NemianEntityKinds";

export class Desert extends Cartogram<TheniaEnemy, TheniaCreature, TheniaItem, TheniaDoodad, TheniaTerrain> {}
type TheniaMap = Cartogram<TheniaEnemy, TheniaCreature, TheniaItem, TheniaDoodad, TheniaTerrain> 

const e = 1024
export class TheniaEngine extends World<TheniaEnemy, TheniaCreature, TheniaItem, TheniaDoodad, TheniaTerrain> {
    messageLog: string[] = []
    dimensions: Point = [e,e]
    critterSpeed: number = 0.011
    enemySpeed: number = 0.002
    private cartogram: TheniaMap;
    private riding: TheniaCreature | null = null
    private player: Player = new Player();
    private enemyController: EnemyController = new EnemyController(this);

    constructor() { 
        super()
        this.cartogram = new Desert(this.dimensions, nemianKinds);
    }


    get map(): TheniaMap { return this.cartogram;}

    createdAt: number = new Date().getTime();
    updateCreature(creature: TheniaCreature) {
        let [x, y] = this.map.getCreaturePosition(creature);
        let v: Vector = creature.state.facing || new Vector(
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
        this.enemyController.update(enemy);
    }

    updatePlayer(): void {}

    scan(origin: [number, number], radius: number): [TheniaEnemy | TheniaItem | TheniaCreature, Point] | null {
        let sz = GridView.cellSize;
        let matches: [TheniaItem | TheniaCreature, Point][] = [];
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
            let [x,y] = this.player.location
            let sz = GridView.cellSize;
            this.map.setCreaturePosition(this.riding, [x/sz,y/sz])
            this.riding = null;
        }
    }

    setPlayerLocation(pos: Point) {
        this.player.location = pos
    }

    getPlayerLocation() {
        return this.player.location
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

    givePlayerQuest(q: Quest): void {
        this.player.quests.push(q);
    }

    get currentPlayerQuest(): Quest {
        return this.player.quests[0];
    }

    completeQuest(q: { kind: "seek"; goal: import("../World").Wonder | import("../World").Item; }): void {
        let i = this.player.quests.indexOf(q);
        delete this.player.quests[i];
    }
}

export default TheniaEngine;