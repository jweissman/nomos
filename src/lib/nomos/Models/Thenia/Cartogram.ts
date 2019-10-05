import Point from "../../Values/Point";
import { WorldMap } from "../World";
import { TheniaDoodad } from "./TheniaDoodad";
import { TheniaTerrain } from "./TheniaTerrain";
import { TheniaCreature } from "./TheniaCreature";
import { TheniaEnemy } from "./TheniaEnemy";
import { TheniaItem } from "./TheniaItem";
import { MapLayer } from "./MapLayer";

type Open = { kind: 'open' }
type Blocked = { kind: 'blocked' }
const free: Open = { kind: 'open' };
const block: Blocked = { kind: 'blocked' };
type BlockedState = Blocked | Open

const doodadKinds: TheniaDoodad[] = [
    TheniaDoodad.none(),
    TheniaDoodad.rock(),
    TheniaDoodad.cactus(),
    TheniaDoodad.bigCactus(),
    TheniaDoodad.shrub(),
    TheniaDoodad.bones(),
    TheniaDoodad.bones(),
    TheniaDoodad.pillar(),
    TheniaDoodad.pillarCollapsed(),
    TheniaDoodad.oasis(),
    TheniaDoodad.smallPool(),
    
];
const creatureKinds: TheniaCreature[] = [
    TheniaCreature.none(),
    TheniaCreature.mouse(),
    TheniaCreature.horse(),
];
const itemKinds: TheniaItem[] = [
    TheniaItem.none(),
    TheniaItem.coin(),
    TheniaItem.coin({ spriteName: 'coinCollected', collected: true, }),
    TheniaItem.root(),
    TheniaItem.root({ spriteName: 'rootGathered', collected: true, }),
    TheniaItem.note('abstract message'),
    TheniaItem.note('the message has been received', { spriteName: 'letterRead', collected: true, }),
];

const enemyKinds: TheniaEnemy[] = [
    TheniaEnemy.none(),
    TheniaEnemy.bandit(),
];

const terrainKinds: TheniaTerrain[] = [
    TheniaTerrain.none(),
    TheniaTerrain.scrub(),
    TheniaTerrain.grass(),
    TheniaTerrain.flowers(),
    TheniaTerrain.stone(),
];

export class Cartogram extends WorldMap<TheniaEnemy, TheniaCreature, TheniaItem, TheniaDoodad, TheniaTerrain> {
    private blocked: MapLayer<BlockedState>;
    private doodads: MapLayer<TheniaDoodad>;
    private creatures: MapLayer<TheniaCreature>;
    private territory: MapLayer<TheniaTerrain>;
    private items: MapLayer<TheniaItem>;
    private enemies: MapLayer<TheniaEnemy>;

    constructor(public dimensions: Point) {
        super();
        this.territory = new MapLayer<TheniaTerrain>('terrain', dimensions, terrainKinds);
        this.items = new MapLayer<TheniaItem>('items', dimensions, itemKinds);
        this.doodads = new MapLayer<TheniaDoodad>('doodads', dimensions, doodadKinds);
        this.creatures = new MapLayer<TheniaCreature>('critters', dimensions, creatureKinds, false);
        this.enemies = new MapLayer<TheniaEnemy>('enemies', dimensions, enemyKinds, false);
        this.blocked = new MapLayer<BlockedState>('blocks', dimensions, [free, block]);
    }

    putDoodad(doodad: TheniaDoodad, position: Point): void {
        let [x, y] = position;
        if (doodad.size > 1) {
            let blockedHeight = 3 * Math.floor(doodad.size / 4)
            // if (!!clear) {
                for (let dx = 0; dx < doodad.size; dx++) {
                    for (let dy = blockedHeight-1; dy < doodad.size; dy++) {
                        let r: Point = [
                            // x+dx,y+dy
                            Math.min(x + dx, this.dimensions[0] - 1),
                            Math.min(y + dy, this.dimensions[1] - 1)
                        ]
                        this.removeDoodad(r)
                    }
                }
            // }
            for (let dx = 0; dx < doodad.size; dx++) {
                let dy = doodad.size -1
                    let r: Point = [
                        Math.min(x + dx, this.dimensions[0] - 1),
                        Math.min(y + dy, this.dimensions[1] - 1)
                    ]
                    let doSpawn = true;
                    if (doodad.halfWidth) {
                        doSpawn = dx < doodad.size/2
                    }

                    if (doSpawn) {
                        this.blocked.spawn(block, r)
                    }
            }
        } else {
            // this.blocked.spawn(block, position)
            // this.doodads.remove(position)
            // this.removeDoodad(position)
        }
        this.doodads.spawn(doodad, position);
    }

    removeDoodad(pos: Point): void { this.doodads.remove(pos); }

    setTerrain(value: TheniaTerrain, position: Point): void {
        this.territory.spawn(value, position);
    }
    getTerrainKindAt(pos: [number, number]) {
        return this.territory.getKindAt(pos);
    }
    assembleTerrain() {
        return this.territory.map;
    }
    listTerrainKinds(): TheniaTerrain[] {
        return terrainKinds;
    }

    spawnCritter(creature: TheniaCreature, position: Point) {
        this.creatures.spawn(creature, position);
    }
    assembleDoodads(): number[][] {
        return this.doodads.map;
    }
    listDoodadKinds(): TheniaDoodad[] {
        return doodadKinds;
    }
    getDoodadKindAt(position: Point): TheniaDoodad | null {
        return this.doodads.getKindAt(position)
    }

    listCritterKinds(): TheniaCreature[] {
        return creatureKinds;
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

    getItemKindAt(pos: Point): TheniaItem | null {
        return this.items.getKindAt(pos)
    }
    
    isBlocked(position: [number, number], size: number = 1, checkHalfway: boolean = false): boolean {
        let [x, y] = position;
        // if (x < 0 || y < 0 || x > this.dimensions[0] || y > this.dimensions[1]) {
        //     return true;
        // }
        let grid = this.blocked.map;
        let gx_base = Math.floor(x);
        let gy_base = Math.floor(y);
        let [gx,gy] = this.blocked.deref([gx_base, gy_base])

        let vy = Math.abs(y-gy)
        let overHalfwayDown = checkHalfway ? vy > 0.5 : true //&& vy < 0.9 : true
        let blocked = false;
        for (let dx = 0; dx < size; dx++) {
            for (let dy = 0; dy < size; dy++) {
                if (grid[gy + dy]) {
                    let value = grid[gy + dy][gx + dx];
                    if (value !== 0 && overHalfwayDown) {
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
    spawnEnemy(enemy: TheniaEnemy, position: [number, number]): void {
        this.enemies.spawn(enemy, position);
    }
    listEnemyKinds(): TheniaEnemy[] {
        return enemyKinds;
    }
    listEnemies(): TheniaEnemy[] {
        return this.enemies.list;
    }
    findEnemies(start: [number, number], end: [number, number]): {
        it: TheniaEnemy;
        position: [number, number];
    }[] {
        let found = this.enemies.find(start, end);
        return found
    }

    getEnemyPosition(enemy: TheniaEnemy): Point {
        return this.enemies.getPos(enemy);
    }

    setEnemyPosition(enemy: TheniaEnemy, position: Point) {
        this.enemies.setPos(enemy, position);
    }

    getItemPosition(item: TheniaItem): [number, number] {
        return this.items.getPos(item);
    }

    listItemKinds(): TheniaItem[] {
        return itemKinds;
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
