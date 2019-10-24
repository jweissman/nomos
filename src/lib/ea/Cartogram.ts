import Point from "../nomos/Values/Point";
import { MapLayer } from "./MapLayer";
import { Creature, Doodad, Enemy, Item, Person, Terrain } from "./World";
import { WorldMap } from "./WorldMap";

interface Open { kind: "open"; }
interface Blocked { kind: "blocked"; }
const free: Open = { kind: "open" };
const block: Blocked = { kind: "blocked" };
type BlockedState = Blocked | Open;

export interface EntityKinds<
    E extends Enemy, C extends Creature, I extends Item, D extends Doodad, T extends Terrain, P extends Person
    > {
    doodad: D[];
    item: I[];
    creature: C[];
    enemies: E[];
    terrain: T[];
    people: P[];
}

export class Cartogram<
    E extends Enemy, C extends Creature, I extends Item, D extends Doodad, T extends Terrain, P extends Person
    > extends WorldMap<E, C, I, D, T, P> {

    private blocked: MapLayer<BlockedState>;
    private doodads: MapLayer<D>;
    private creatures: MapLayer<C>;
    private territory: MapLayer<T>;
    private items: MapLayer<I>;
    private enemies: MapLayer<E>;
    private people: MapLayer<P>;

    constructor(public dimensions: Point, private entityKinds: EntityKinds<E, C, I, D, T, P>) {
        super();
        this.territory = new MapLayer<T>("terrain", dimensions, this.entityKinds.terrain);
        this.items = new MapLayer<I>("items", dimensions, this.entityKinds.item);
        this.doodads = new MapLayer<D>("doodads", dimensions, this.entityKinds.doodad);
        this.creatures = new MapLayer<C>("critters", dimensions, this.entityKinds.creature, false);
        this.enemies = new MapLayer<E>("enemies", dimensions, this.entityKinds.enemies, false);
        this.people = new MapLayer<P>("people", dimensions, this.entityKinds.people, false);
        this.blocked = new MapLayer<BlockedState>("blocks", dimensions, [free, block]);
    }

    public putDoodad(doodad: D, position: Point): void {
        const [x, y] = position;
        if (doodad.size > 1) {
            const blockedHeight = 3 * Math.floor(doodad.size / 4);
            for (let dx = 0; dx < doodad.size; dx++) {
                for (let dy = blockedHeight - 1; dy < doodad.size; dy++) {
                    const r: Point = [
                        Math.min(x + dx, this.dimensions[0] - 1),
                        Math.min(y + dy, this.dimensions[1] - 1),
                    ];
                    this.removeDoodad(r);
                }
            }
            for (let dx = 0; dx < doodad.size; dx++) {
                const dy = doodad.size - 1;
                const r: Point = [
                    Math.min(x + dx, this.dimensions[0] - 1),
                    Math.min(y + dy, this.dimensions[1] - 1),
                ];
                let doSpawn = true;
                if (doodad.halfWidth) {
                    doSpawn = dx < doodad.size / 2;
                    }

                if (doSpawn) {
                        this.blocked.spawn(block, r);
                    }
            }
        }
        this.doodads.spawn(doodad, position);
    }

    public removeDoodad(pos: Point): void { this.doodads.remove(pos); }

    public setTerrain(value: T, position: Point): void {
        this.territory.spawn(value, position);
    }
    public getTerrainKindAt(pos: [number, number]) {
        return this.territory.getKindAt(pos);
    }
    public assembleTerrain() {
        return this.territory.map;
    }
    public listTerrainKinds() {
        return this.entityKinds.terrain;
    }

    public spawnCritter(creature: C, position: Point) {
        this.creatures.spawn(creature, position);
    }
    public assembleDoodads(): number[][] {
        return this.doodads.map;
    }
    public listDoodadKinds(): D[] {
        return this.entityKinds.doodad;
    }
    public getDoodadKindAt(position: Point): D | null {
        return this.doodads.getKindAt(position);
    }

    public listCritterKinds(): C[] {
        return this.entityKinds.creature;
    }
    public listCreatures() { return this.creatures.list; }

    public findCreatures(start: Point, end: Point): Array<{
        it: C;
        position: Point;
    }> {
        return this.creatures.find(start, end);
    }

    public findItems(start: Point, end: Point) {
        return this.items.find(start, end);
    }

    public getItemKindAt(pos: Point): I | null {
        return this.items.getKindAt(pos);
    }

    public isBlocked(position: [number, number], size: number = 1, checkHalfway: boolean = false): boolean {
        const [x, y] = position;
        const grid = this.blocked.map;
        let gx_base = Math.floor(x);
        let gy_base = Math.floor(y);
        const [gx, gy] = this.blocked.deref([gx_base, gy_base]);

        const vy = Math.abs(y - gy);
        const overHalfwayDown = checkHalfway ? vy > 0.5 : true;
        let blocked = false;
        for (let dx = 0; dx < size; dx++) {
            for (let dy = 0; dy < size; dy++) {
                if (grid[gy + dy]) {
                    const value = grid[gy + dy][gx + dx];
                    if (value !== 0 && overHalfwayDown) {
                        blocked = true;
                    }
                }
            }
        }
        return blocked;
    }

    public getCreaturePosition(creature: C): Point {
        return this.creatures.getPos(creature);
    }

    public setCreaturePosition(creature: C, position: Point): void {
        this.creatures.setPos(creature, position);
    }
    public spawnEnemy(enemy: E, position: [number, number]): void {
        this.enemies.spawn(enemy, position);
    }
    public listEnemyKinds(): E[] {
        return this.entityKinds.enemies;
    }
    public listEnemies(): E[] {
        return this.enemies.list;
    }
    public findEnemies(start: [number, number], end: [number, number]): Array<{
        it: E;
        position: [number, number];
    }> {
        const found = this.enemies.find(start, end);
        return found;
    }

    public getEnemyPosition(enemy: E): Point {
        return this.enemies.getPos(enemy);
    }

    public setEnemyPosition(enemy: E, position: Point) {
        this.enemies.setPos(enemy, position);
    }

    public getItemPosition(item: I): [number, number] {
        return this.items.getPos(item);
    }

    public listItemKinds(): I[] {
        return this.entityKinds.item;
    }

    public listItems(): I[] {
        return this.items.list;
    }

    public assembleItems(): number[][] {
        return this.items.map;
    }

    public placeItem(it: I, position: Point): void {
        this.items.spawn(it, position);
    }

    public updateItemAt(pos: [number, number], it: I): void {
        this.items.updateAt(pos, it);
    }

    public spawnPerson(person: P, position: [number, number]): void {
        this.people.spawn(person, position);
    }
    public listPeopleKinds(): P[] {
        return this.entityKinds.people;
    }
    public getPersonKindAt(position: [number, number]): P | null {
        return this.people.getKindAt(position);
    }
    public listPeople(): P[] {
        return this.people.list;
    }
    public findPeople(start: [number, number], end: [number, number]): Array<{ it: P; position: [number, number]; }> {
        return this.people.find(start, end);
    }
    public getPersonPosition(person: P): [number, number] {
        return this.people.getPos(person);
    }
    public setPersonPosition(person: P, position: [number, number]): void {
        return this.people.setPos(person, position);
    }
}
