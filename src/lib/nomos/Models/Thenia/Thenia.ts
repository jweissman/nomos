import Point from "../../Values/Point";
import GridView from "../../Actors/GridView";
import { World, Creature } from "../World";
import { TheniaDoodad, TheniaTerrain, zed, rock, tree, shrub, grass, water, dirt, TheniaCreature } from "./Structures";
import { TheniaItem } from "./TheniaItem";
import distance from "../../../util/distance";
import { Vector } from "excalibur";

class Thenia extends World<TheniaCreature, TheniaItem, TheniaDoodad, TheniaTerrain> {
    dimensions: Point = [3000,3000]
    private terrain: Array<Array<number>>;
    private doodadMap: Array<Array<number>>;
    private creatureMap: Array<Array<number>>;
    private itemMap: Array<Array<number>>;

    private itemList: TheniaItem[] = []
    private itemPositions: Point[] = []
    private creatureList: TheniaCreature[] = []
    private creaturePositions: Point[] = []
    riding: TheniaCreature | null = null

    playerPos: Point = [-1,-1]

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
        // iota(m-1).forEach(y => {
        for (let y=0; y<m; y++) {
            this.itemMap[y] = Array(n);
            this.itemMap[y].fill(0,0,n);
            this.doodadMap[y] = Array(n);
            this.doodadMap[y].fill(0,0,n);
            this.terrain[y] = Array(n);
            this.terrain[y].fill(0,0,n);
            this.creatureMap[y] = Array(n);
            this.creatureMap[y].fill(0,0,n);
        }
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
        TheniaCreature.horse(),
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
        this.itemList.push(it);
        this.itemPositions.push(position);
        this.itemMap[y][x] = this.itemKinds.map(e=>e.kind).indexOf(it.kind)
    }

    spawnCritter(creature: TheniaCreature, position: Point) {
        this.creatureList.push(creature);
        this.creaturePositions.push(position);
    }

    assembleDoodads(): number[][] {
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
        for (let i=0; i<this.creatureList.length; i++) {
            let [x,y] = this.creaturePositions[i];
            if (x >= sx && x <= ex && y >= sy && y <= ey) {
                critters.push({ creature: this.creatureList[i], position: [x,y] })
            }
        }
        return critters;
    }

    updateCreature(creature: Creature, n: number = 3) {
        let i = this.listCreatures().indexOf(creature)
        for (let t = 0; t < n; t++) {
            this.moveCritter(i);
        }
    }

    critterSpeed: number = 0.5
    moveCritter(i: number) {
        let creature = this.creatureList[i];
        let [x, y] = this.creaturePositions[i];
        let v = creature.state.facing || new Vector(
            1 - (Math.random() * 2),
            1 - (Math.random() * 2),
        )
        // if (Math.random() < 0.001) {
        //     v.addEqual(
        //         new Vector(
        //             1 - (Math.random() * 2),
        //             1 - (Math.random() * 2),
        //         )
        //     )
        // }
        v = v.normalize().scale(this.critterSpeed)
        let newPosVec: Vector = new Vector(x, y).add(v)
        let newPos: Point = [newPosVec.x, newPosVec.y]
        if (this.isBlocked(newPos)) {
            creature.state.facing = null;
        } else {
            this.creaturePositions[i] = newPos;
            creature.state = {
                ...creature.state,
                facing: v
            }
        }
    }


    isBlocked(position: [number, number]): boolean {
        let [x, y] = position;
        if (x < 0 || y < 0 || x > this.dimensions[0] * GridView.cellSize || y > this.dimensions[1] * GridView.cellSize) { return true }
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

    scan(origin: [number, number], radius: number): [TheniaItem | TheniaCreature, Point] | null {
        let matching: [TheniaItem | TheniaCreature, Point] | null = null;
        let [ox, oy] = origin;
        let sz = GridView.cellSize;
        this.itemList.forEach((item: TheniaItem, i: number) => {
            let position = this.itemPositions[i];
            let [ix, iy] = [position[0] * sz, position[1] * sz];
            if (distance([ox - sz / 2, oy - sz / 2], [ix, iy]) < radius) {
                matching = [item, position]
            }
        })
        this.findCreatures(
            [ox / sz - radius / sz, oy / sz - radius / sz],
            [ox / sz + radius / sz, oy / sz + radius / sz],
        )
        .forEach(({ creature, position }) => {
            matching = [creature, [position[0] / sz - 0.5, position[1] / sz - 0.5]]
        })
        return matching;
    }

    interact(it: TheniaItem, pos: Point): string {
        let message = it.handleInteraction();
        let [x, y] = pos;
        this.itemMap[y][x] = this.itemKinds.map(e => e.kind).indexOf(it.kind)
        return message;
    }

    ride(it: TheniaCreature) {
        it.state.visible = false;
        this.riding = it;
    }

    dismount() {
        if (this.riding) {
            this.riding.state.visible = true;
            this.teleportCreature(this.riding, this.playerPos)
            this.riding = null;
        }
    }

    private teleportCreature(creature: Creature, pos: Point) {
        let i = this.creatureList.indexOf(creature);
        this.creaturePositions[i] = pos;
    }

    setPlayerLocation(pos: Point) { //x: number, y: number) {
        this.playerPos = pos
    }

    getPlayerLocation() {
        return this.playerPos
    }
}

export default Thenia;