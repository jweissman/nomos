import TheniaEngine from ".";
import { TheniaCreature } from "./TheniaCreature";
import { Vector } from "excalibur";
import getRandomUnitVector from "../../../util/getRandomUnitVector";
import Point from "../../Values/Point";
import GridView from "../../Actors/GridView";
import distance from "../../../util/distance";

export default class CreatureController {
    constructor(private world: TheniaEngine) {}

    private get map() { return this.world.map; }
    private get speed() { return this.world.critterSpeed; }

    update(creature: TheniaCreature) {
        // creature.update();
        let now = new Date().getTime();
        if (creature.state.activity === 'taming') {
            let tamingTime = 600;
            if (now - creature.startedTamingAt > tamingTime) {
                creature.state.activity = 'idle';
                creature.isTame = true;
            }
        }

        if (creature.isTame) {
            this.updateTameCreature(creature);
            return;
        }

        if (creature.state.activity !== 'taming') {
            let v: Vector = creature.state.facing || getRandomUnitVector()
            if (Math.random() < 0.002) {
                v = getRandomUnitVector();
            }
            this.moveCreature(creature, v);
        }
    }


    private moveCreature(creature: TheniaCreature, vector: Vector, speed: number = this.speed) {
        let [x, y] = this.map.getCreaturePosition(creature);
        let vec = vector.normalize().scale(speed)
        let newPosVec: Vector = new Vector(x, y).add(vec)
        let newPos: Point = [newPosVec.x, newPosVec.y]
        if (this.map.isBlocked(newPos)) {
            creature.state.facing = null;
        } else {
            this.map.setCreaturePosition(creature, newPos);
            creature.state = {
                ...creature.state,
                facing: vector
            }
        }
    }


    private updateTameCreature(creature: TheniaCreature) {
        let pos = this.map.getCreaturePosition(creature);
        let sz = GridView.cellSize;
        let [px, py] = this.world.getPlayerLocation();
        let d = distance([px / sz - 0.5, py / sz - 0.5], pos);
        if (d > 1.6) {
            let [x,y] = pos;
            let creatureLocation = new Vector(x * sz, y * sz);
            let targetLocation = new Vector(px, py);
            let v = targetLocation.sub(creatureLocation);
            let s = d > 3 ? 3.2 : 1.4
            this.moveCreature(creature, v, this.speed * s);
        } else {
            let v: Vector = creature.state.facing || getRandomUnitVector()
            if (Math.random() < 0.004) {
                v = getRandomUnitVector();
            }
            this.moveCreature(creature, v, this.speed * 0.25 )
        }
    }
}