import Point from "../nomos/Values/Point";
import { Creature, Doodad, Enemy, Item, Person, Terrain } from "./Values";
export abstract class WorldMap<E extends Enemy, C extends Creature, I extends Item, D extends Doodad, T extends Terrain, P extends Person> {
    public abstract dimensions: Point;
    public abstract setTerrain(terain: T, position: Point): void;
    public abstract putDoodad(doodad: D, position: Point): void;
    public abstract placeItem(it: I, position: Point): void;
    public abstract spawnCritter(creature: C, position: Point): void;
    public abstract spawnEnemy(enemy: E, position: Point): void;
    public abstract spawnPerson(person: P, position: Point): void;
    public abstract isBlocked(position: Point, size?: number, checkHalfway?: boolean): boolean;
    public abstract listDoodadKinds(): D[];
    public abstract listTerrainKinds(): T[];
    public abstract listItemKinds(): I[];
    public abstract listCritterKinds(): C[];
    public abstract listEnemyKinds(): E[];
    public abstract listPeopleKinds(): P[];
    public abstract removeDoodad(point: Point): void;
    public abstract getDoodadKindAt(position: Point): D | null;
    public abstract getTerrainKindAt(position: Point): T | null;
    public abstract getItemKindAt(position: Point): I | null;
    public abstract getPersonKindAt(position: Point): P | null;
    public abstract listItems(): I[];
    public abstract findItems(start: Point, end: Point): Array<{
        it: I;
        position: Point;
    }>;
    public abstract getItemPosition(item: I): Point;
    public abstract updateItemAt(pos: Point, it: I): void;
    public abstract listCreatures(): C[];
    public abstract findCreatures(start: Point, end: Point): Array<{
        it: C;
        position: Point;
    }>;
    public abstract getCreaturePosition(creature: C): Point;
    public abstract setCreaturePosition(creature: C, position: Point): void;
    public abstract listEnemies(): E[];
    public abstract findEnemies(start: Point, end: Point): Array<{
        it: E;
        position: Point;
    }>;
    public abstract getEnemyPosition(enemy: E): Point;
    public abstract setEnemyPosition(enemy: E, position: Point): void;
    public abstract listPeople(): P[];
    public abstract findPeople(start: Point, end: Point): Array<{
        it: P;
        position: Point;
    }>;
    public abstract getPersonPosition(person: P): Point;
    public abstract setPersonPosition(person: P, position: Point): void;
}
