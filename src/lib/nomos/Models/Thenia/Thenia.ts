import Point from "../../Values/Point";
import { iota } from "../../../util/iota";
import GridView from "../../Actors/GridView";
import { World } from "../World";
import { TheniaDoodad, TheniaTerrain, zed, rock, tree, shrub, grass, water, dirt, TheniaCreature } from "./Structures";
import { TheniaItem } from "./TheniaItem";
import distance from "../../../util/distance";
import { Vector } from "excalibur";

class Thenia extends World<TheniaCreature, TheniaItem, TheniaDoodad, TheniaTerrain> {

    playerPos: Point = [0,0]

    setPlayerPosition(x: number, y: number) {
        this.playerPos = [x,y]
    }

    dimensions: Point = [5000,5000]
    terrain: Array<Array<number>>;
    doodadMap: Array<Array<number>>;
    creatureMap: Array<Array<number>>;
    itemMap: Array<Array<number>>;

    itemList: TheniaItem[] = []
    itemPositions: Point[] = []

    creatureList: TheniaCreature[] = []
    creaturePositions: Point[] = []

    constructor() {
        super();
        this.doodadMap = [];
        this.itemMap = [];
        this.itemList = [];
        this.terrain = [];
        this.creatureMap = [];
        this.zeroOut();
    }

    zeroOut() {
        let [m,n] = this.dimensions;
        iota(m-1).forEach(y => {
            this.itemMap[y] = Array(n);
            this.itemMap[y].fill(0,0,n);
            this.doodadMap[y] = Array(n);
            this.doodadMap[y].fill(0,0,n);
            this.terrain[y] = Array(n);
            this.terrain[y].fill(0,0,n);
            this.creatureMap[y] = Array(n);
            this.creatureMap[y].fill(0,0,n);
        })
    }

    doodadKinds: TheniaDoodad[] = [
        zed(),
        rock(),
        tree(),
        shrub(),
    ];

    terrainKinds: TheniaTerrain[] = [
        zed(),
        grass(),
        water(),
        dirt(),
    ]

    itemKinds: TheniaItem[] = [
        TheniaItem.none(),
        TheniaItem.coin(),
        TheniaItem.coin({ spriteName: 'coinCollected', collected: true, }),
        TheniaItem.root(),
        TheniaItem.root({ spriteName: 'rootGathered', collected: true, }),
    ]

    creatureKinds: TheniaCreature[] = [
        TheniaCreature.none(),
        TheniaCreature.mouse(),
    ]

    putDoodad(doodad: TheniaDoodad, position: Point): void {
        let [x, y] = position;
        let indexValue = this.listDoodads().indexOf(doodad);
        if (doodad.size > 1) {
            for (let dx = 0; dx < doodad.size; dx++) {
                for (let dy = 0; dy < doodad.size; dy++) {
                    if (this.doodadMap[y+dy]) {
                        this.doodadMap[y + dy][x + dx] = -1
                    }
                }
            }
        }
        this.doodadMap[y][x] = indexValue;
    }

    setTerrain(value: number, position: Point): void {
        let [x, y] = position;
        this.terrain[y][x] = value
    }

    placeItem(it: TheniaItem, position: Point): void {
        let [x, y] = position;
        this.itemList.push(it); //{ it, position })
        this.itemPositions.push(position);
        this.itemMap[y][x] = this.itemKinds.map(e=>e.kind).indexOf(it.kind)
    }

    spawnCritter(creature: TheniaCreature, position: Point) {
        // let [x, y] = position;
        this.creatureList.push(creature);
        this.creaturePositions.push(position);
        // this.creatureMap[y][x] = this.creatureKinds.map(e=>e.kind).indexOf(creature.kind);
    }

    assembleDoodads(): number[][] {
        // return [];
        return this.doodadMap;
    }

    listDoodads(): TheniaDoodad[] {
        return this.doodadKinds;
    }

    assembleTerrain() {
        return this.terrain;
    }

    listTerrainKinds(): TheniaTerrain[] {
        return this.terrainKinds;
    }

    listItems(): TheniaItem[] {
        return this.itemKinds;
    }

    assembleItems(): Array<Array<number>> {
        return this.itemMap;
    }

    listCritterKinds(): TheniaCreature[] {
        return this.creatureKinds;
    }

    assembleCritters(): Array<Array<number>> {
        return this.creatureMap;
    }

    listCreatures() { return this.creatureList; }

    findCreatures([sx,sy]: Point, [ex,ey]: Point): { creature: TheniaCreature, position: Point }[] {
        let sz = GridView.cellSize;
        sx *= sz;
        sy *= sz;
        ex *= sz;
        ey *= sz;
        let critters: { creature: TheniaCreature, position: Point }[] = []
        for (let i=0; i<this.creatureList.length-1; i++) {
            let [x,y] = this.creaturePositions[i];
            // x *= sz;
            // y *= sz;
            if (x >= sx && x <= ex && y >= sy && y <= ey) {
                critters.push({ creature: this.creatureList[i], position: [x,y] })
            }
        }
        return critters;
    }
    
    critterSpeed: number = 0.01
    moveCritter(i: number) {
        // console.warn("MOVE CREATURE", i)
        if (Math.random() < 0.1) {
            let creature = this.creatureList[i];
            let [x, y] = this.creaturePositions[i];
            let v = creature.state.facing || new Vector(
                1-(Math.random()*2),
                1-(Math.random()*2),
                // Math.random() > 0.5 ? -1 : 1,
            ) //.normalize().scale(5.0)
            if (Math.random() < 0.00001) {
                v.addEqual(
                    new Vector(
                        1 - (Math.random() * 2),
                        1 - (Math.random() * 2),
                    )
                )
            }
            v = v.normalize().scale(this.critterSpeed)
            let newPosVec: Vector = new Vector(x, y).add(v)
            let newPos: Point = [newPosVec.x, newPosVec.y]
            if (this.isBlocked(newPos)) {
                creature.state.facing = null;
            } else {
                let matchingKind = this.creatureKinds.find(k => k.kind === creature.kind);
                if (matchingKind) {
                    this.creaturePositions[i] = newPos;
                    creature.state = {
                        ...creature.state,
                        facing: v //.toAngle() //+ (Math.PI/2)
                    };
                }
            }
        }
    }

    isBlocked(position: [number, number]): boolean {
        let [x, y] = position;
        if (x < 0 || y < 0 || x > this.dimensions[0]*GridView.cellSize || y > this.dimensions[1]*GridView.cellSize) { return true }
        let grid = this.doodadMap;
        let gx = Math.floor(x / GridView.cellSize);
        let gy = Math.floor(y / GridView.cellSize);
        let blocked = false;
        if (grid[gy]) {
            let value = grid[gy][gx];
            if (value !== 0) {
                blocked = true;
            }
        }
        return blocked;
    }

    scan(origin: [number, number], radius: number): [TheniaItem,Point] | null {
        let matching: [TheniaItem,Point] | null = null;
        let [ox,oy] = origin;
        let sz = GridView.cellSize;
        this.itemList.forEach((item: TheniaItem, i: number) => {
            let position = this.itemPositions[i];
            let [ix,iy] = [position[0]*sz,position[1]*sz];
            if (distance([ox-sz/2,oy-sz/2], [ix,iy]) < radius) {
                matching = [item, position]
            }
        })
        return matching;
    }

    interact(it: TheniaItem, pos: Point): string {
        let message = it.handleInteraction();
        let [x,y] = pos;
        this.itemMap[y][x] = this.itemKinds.map(e=>e.kind).indexOf(it.kind)
        return message;
    }
}


export default Thenia;