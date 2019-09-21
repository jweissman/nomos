import Point from "../../Values/Point";
import { Enemy, WorldMap } from "../World";
import { TheniaDoodad } from "./TheniaDoodad";
import { TheniaTerrain } from "./TheniaTerrain";
import { TheniaCreature } from "./TheniaCreature";
import { TheniaEnemy } from "./TheniaEnemy";
import { TheniaItem } from "./TheniaItem";
import { MapLayer } from "../MapLayer";

type Open = { kind: 'open' }
type Blocked = { kind: 'blocked' }
const free: Open = { kind: 'open' };
const block: Blocked = { kind: 'blocked' };
type BlockedState = Blocked | Open

export class Cartogram extends WorldMap<TheniaEnemy, TheniaCreature, TheniaItem, TheniaDoodad, TheniaTerrain> {
    private blocked: MapLayer<BlockedState>;
    private doodadKinds: TheniaDoodad[] = [
        TheniaDoodad.none(),
        TheniaDoodad.rock(),
        TheniaDoodad.cactus(),
        TheniaDoodad.bigCactus(),
        TheniaDoodad.shrub(),
    ];
    private doodads: MapLayer<TheniaDoodad>;
    creatureKinds: TheniaCreature[] = [
        TheniaCreature.none(),
        TheniaCreature.mouse(),
        TheniaCreature.horse(),
    ];
    private creatures: MapLayer<TheniaCreature>;
    private territory: MapLayer<TheniaTerrain>;
    private terrainKinds: TheniaTerrain[] = [
        TheniaTerrain.none(),
        TheniaTerrain.scrub(),
        TheniaTerrain.grass(),
        TheniaTerrain.flowers(),
        TheniaTerrain.stone(),
    ];
 
    private items: MapLayer<TheniaItem>;
    private itemKinds: TheniaItem[] = [
        TheniaItem.none(),
        TheniaItem.coin(),
        TheniaItem.coin({ spriteName: 'coinCollected', collected: true, }),
        TheniaItem.root(),
        TheniaItem.root({ spriteName: 'rootGathered', collected: true, }),
    ];

    constructor(private dimensions: Point) {
        super();
        this.territory = new MapLayer<TheniaTerrain>('terrain', dimensions, this.terrainKinds);
        this.items = new MapLayer<TheniaItem>('items', dimensions, this.itemKinds);
        this.doodads = new MapLayer<TheniaDoodad>('doodads', dimensions, this.doodadKinds);
        this.creatures = new MapLayer<TheniaCreature>('critters', dimensions, this.creatureKinds, false);
        this.blocked = new MapLayer<BlockedState>('blocks', dimensions, [free, block]);
    }
 
   putDoodad(doodad: TheniaDoodad, position: Point): void {
        this.doodads.spawn(doodad, position);
        let [x, y] = position;
        if (doodad.size > 1) {
            for (let dx = 0; dx < doodad.size; dx++) {
                for (let dy = 0; dy < doodad.size; dy++) {
                    this.blocked.spawn(block, [
                        Math.min(x+dx, this.dimensions[0]-1),
                        Math.min(y+dy,this.dimensions[1]-1)
                    ])
                }
            }
        } else {
            this.blocked.spawn(block, position)
        }
    }

    setTerrain(value: TheniaTerrain, position: Point): void {
        this.territory.spawn(value, position);
    }
    assembleTerrain() {
        return this.territory.map;
    }

    spawnCritter(creature: TheniaCreature, position: Point) {
        // console.log("Try to spawn creature", { creature, position })
        this.creatures.spawn(creature, position);
    }
    assembleDoodads(): number[][] {
        return this.doodads.map;
    }
    listDoodadKinds(): TheniaDoodad[] {
        return this.doodadKinds;
    }
    listTerrainKinds(): TheniaTerrain[] {
        return this.terrainKinds;
    }
    listCritterKinds(): TheniaCreature[] {
        return this.creatureKinds;
    }
    listCreatures() { return this.creatures.list; }

    findCreatures(start: Point, end: Point): {
        it: TheniaCreature;
        position: Point;
    }[] {
        return this.creatures.find(start, end)
    }

    findItems(start: Point, end: Point) {
        return this.items.find(start, end);
    }

    isBlocked(position: [number, number], size: number=1): boolean {
        let [x, y] = position;
        if (x < 0 || y < 0 || x > this.dimensions[0] || y > this.dimensions[1]) {
            return true;
        }
        let grid = this.blocked.map;
        // console.log("blocked grid", grid)
        let gx = Math.floor(x);
        let gy = Math.floor(y);
        // this.blocked.map[]
        let blocked = false;

        for (let dx = 0; dx < size; dx++) {
            for (let dy = 0; dy < size; dy++) {
                if (grid[gy + dy]) {
                    let value = grid[gy + dy][gx + dx];
                    if (value !== 0) {
                        console.log("BLOCKED AT", { position, value })
                        blocked = true;
                    }
                }
            }
        }
        return blocked;
    }

    getCreaturePosition(creature: TheniaCreature): Point {
        return this.creatures.getPos(creature)
    }

    setCreaturePosition(creature: TheniaCreature, position: Point): void {
        this.creatures.setPos(creature, position);
    }

    listEnemyPositions(): [number, number][] {
        throw new Error("Method not implemented.");
    }
    spawnEnemy(enemy: Enemy, position: [number, number]): void {
        throw new Error("Method not implemented.");
    }
    listEnemyKinds(): TheniaEnemy[] {
        throw new Error("Method not implemented.");
    }
    listEnemies(): TheniaEnemy[] {
        throw new Error("Method not implemented.");
    }
    findEnemies(start: [number, number], end: [number, number]): {
        enemy: TheniaEnemy;
        position: [number, number];
    }[] {
        throw new Error("Method not implemented.");
    }

    getItemPosition(item: TheniaItem): [number, number] {
        return this.items.getPos(item);
    }

    listItemKinds(): TheniaItem[] {
        return this.itemKinds;
    }

    listItems(): TheniaItem[] {
        return this.items.list;
    }

    assembleItems(): Array<Array<number>> {
        return this.items.map;
    }

    placeItem(it: TheniaItem, position: Point): void {
        this.items.spawn(it, position);
    }

    updateItemAt(pos: [number, number], it: TheniaItem): void {
        this.items.updateAt(pos, it);
    }
}