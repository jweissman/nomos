import Point from "../../Values/Point";
import GridView from "../../Actors/GridView";
import World from "../World";
import { TheniaDoodad } from "./TheniaDoodad";
import { TheniaTerrain } from "./TheniaTerrain";
import { TheniaCreature } from "./TheniaCreature";
import { TheniaEnemy } from "./TheniaEnemy";
import { TheniaItem } from "./TheniaItem";
import distance from "../../../util/distance";
import { Vector } from "excalibur";
import { Cartogram } from "./Cartogram";

class Thenia extends World<TheniaEnemy, TheniaCreature, TheniaItem, TheniaDoodad, TheniaTerrain> {
    dimensions: Point = [500,500]
    critterSpeed: number = 0.023
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

    scan(origin: [number, number], radius: number): [TheniaItem | TheniaCreature, Point] | null {
        let matching: [TheniaItem | TheniaCreature, Point] | null = null;
        let [ox, oy] = origin;
        let sz = GridView.cellSize;
        this.map.listItems().forEach((item: TheniaItem, i: number) => {
            if (!item.state.collected) {
                let position = this.map.getItemPosition(item);
                let [x, y] = position;
                let [ix, iy] = [x * sz, y * sz];
                if (distance([ox - sz / 2, oy - sz / 2], [ix, iy]) < radius) {
                    matching = [item, position]
                }
            }
        })

        let frame: Point[] = [
            [ox / sz - radius / sz, oy / sz - radius / sz],
            [ox / sz + radius / sz, oy / sz + radius / sz],
        ];
        this.map.findCreatures(frame[0], frame[1]) .forEach(({ it: creature, position }) => {
            // console.log("MATCH", position)
            matching = [creature, [position[0] - 0.5, position[1] - 0.5]]
        })
        return matching;
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

    attack(enemy: TheniaEnemy): {
        damage?: number;
        damaged: boolean;
    } {
        throw new Error("Method not implemented.");
    }
}

export default Thenia;