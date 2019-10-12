import Point from "../nomos/Values/Point";
import { MapLayer } from "./MapLayer";
import { Enemy, Creature, Item, Terrain, Doodad, WorldMap, Person } from "./World";

type Open = { kind: 'open' }
type Blocked = { kind: 'blocked' }
const free: Open = { kind: 'open' };
const block: Blocked = { kind: 'blocked' };
type BlockedState = Blocked | Open

export type EntityKinds<E extends Enemy, C extends Creature, I extends Item, D extends Doodad, T extends Terrain, P extends Person> = {
    doodad: D[],
    item: I[],
    creature: C[],
    enemies: E[]
    terrain: T[],
    people: P[],
}

export class Cartogram<E extends Enemy, C extends Creature, I extends Item, D extends Doodad, T extends Terrain, P extends Person> 
  extends WorldMap<E, C, I, D, T, P>
{
    
    private blocked: MapLayer<BlockedState>;
    private doodads: MapLayer<D>;
    private creatures: MapLayer<C>;
    private territory: MapLayer<T>;
    private items: MapLayer<I>;
    private enemies: MapLayer<E>;
    private people: MapLayer<P>;

    constructor(public dimensions: Point, private entityKinds: EntityKinds<E, C, I, D, T, P>) {
        super();
        this.territory = new MapLayer<T>('terrain', dimensions, this.entityKinds.terrain);
        this.items = new MapLayer<I>('items', dimensions, this.entityKinds.item);
        this.doodads = new MapLayer<D>('doodads', dimensions, this.entityKinds.doodad);
        this.creatures = new MapLayer<C>('critters', dimensions, this.entityKinds.creature, false);
        this.enemies = new MapLayer<E>('enemies', dimensions, this.entityKinds.enemies, false);
        this.people = new MapLayer<P>('people', dimensions, this.entityKinds.people, false);
        this.blocked = new MapLayer<BlockedState>('blocks', dimensions, [free, block]);
    }

    putDoodad(doodad: D, position: Point): void {
        let [x, y] = position;
        if (doodad.size > 1) {
            let blockedHeight = 3 * Math.floor(doodad.size / 4)
            for (let dx = 0; dx < doodad.size; dx++) {
                for (let dy = blockedHeight - 1; dy < doodad.size; dy++) {
                    let r: Point = [
                        Math.min(x + dx, this.dimensions[0] - 1),
                        Math.min(y + dy, this.dimensions[1] - 1)
                    ]
                    this.removeDoodad(r)
                }
            }
            for (let dx = 0; dx < doodad.size; dx++) {
                let dy = doodad.size - 1
                let r: Point = [
                    Math.min(x + dx, this.dimensions[0] - 1),
                    Math.min(y + dy, this.dimensions[1] - 1)
                ]
                let doSpawn = true;
                if (doodad.halfWidth) {
                    doSpawn = dx < doodad.size / 2
                    }

                    if (doSpawn) {
                        this.blocked.spawn(block, r)
                    }
            }
        }
        this.doodads.spawn(doodad, position);
    }

    removeDoodad(pos: Point): void { this.doodads.remove(pos); }

    setTerrain(value: T, position: Point): void {
        this.territory.spawn(value, position);
    }
    getTerrainKindAt(pos: [number, number]) {
        return this.territory.getKindAt(pos);
    }
    assembleTerrain() {
        return this.territory.map;
    }
    listTerrainKinds() {
        return this.entityKinds.terrain;
    }

    spawnCritter(creature: C, position: Point) {
        this.creatures.spawn(creature, position);
    }
    assembleDoodads(): number[][] {
        return this.doodads.map;
    }
    listDoodadKinds(): D[] {
        return this.entityKinds.doodad;
    }
    getDoodadKindAt(position: Point): D | null {
        return this.doodads.getKindAt(position)
    }

    listCritterKinds(): C[] {
        return this.entityKinds.creature;
    }
    listCreatures() { return this.creatures.list; }

    findCreatures(start: Point, end: Point): {
        it: C;
        position: Point;
    }[] {
        return this.creatures.find(start, end)
    }

    findItems(start: Point, end: Point) {
        return this.items.find(start, end);
    }

    getItemKindAt(pos: Point): I | null {
        return this.items.getKindAt(pos)
    }
    
    isBlocked(position: [number, number], size: number = 1, checkHalfway: boolean = false): boolean {
        let [x, y] = position;
        let grid = this.blocked.map;
        let gx_base = Math.floor(x);
        let gy_base = Math.floor(y);
        let [gx,gy] = this.blocked.deref([gx_base, gy_base])

        let vy = Math.abs(y-gy)
        let overHalfwayDown = checkHalfway ? vy > 0.5 : true
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

    getCreaturePosition(creature: C): Point {
        return this.creatures.getPos(creature)
    }

    setCreaturePosition(creature: C, position: Point): void {
        this.creatures.setPos(creature, position);
    }
    spawnEnemy(enemy: E, position: [number, number]): void {
        this.enemies.spawn(enemy, position);
    }
    listEnemyKinds(): E[] {
        return this.entityKinds.enemies;
    }
    listEnemies(): E[] {
        return this.enemies.list;
    }
    findEnemies(start: [number, number], end: [number, number]): {
        it: E;
        position: [number, number];
    }[] {
        let found = this.enemies.find(start, end);
        return found
    }

    getEnemyPosition(enemy: E): Point {
        return this.enemies.getPos(enemy);
    }

    setEnemyPosition(enemy: E, position: Point) {
        this.enemies.setPos(enemy, position);
    }

    getItemPosition(item: I): [number, number] {
        return this.items.getPos(item);
    }

    listItemKinds(): I[] {
        return this.entityKinds.item;
    }

    listItems(): I[] {
        return this.items.list;
    }

    assembleItems(): Array<Array<number>> {
        return this.items.map;
    }

    placeItem(it: I, position: Point): void {
        this.items.spawn(it, position);
    }

    updateItemAt(pos: [number, number], it: I): void {
        this.items.updateAt(pos, it);
    }

    spawnPerson(person: P, position: [number, number]): void {
        this.people.spawn(person, position);
    }
    listPeopleKinds(): P[] {
        return this.entityKinds.people;
    }
    getPersonKindAt(position: [number, number]): P | null {
        return this.people.getKindAt(position);
    }
    listPeople(): P[] {
        return this.people.list;
    }
    findPeople(start: [number, number], end: [number, number]): { it: P; position: [number, number]; }[] {
        return this.people.find(start, end);
    }
    getPersonPosition(person: P): [number, number] {
        return this.people.getPos(person);
    }
    setPersonPosition(person: P, position: [number, number]): void {
        return this.people.setPos(person, position);
    }
}
