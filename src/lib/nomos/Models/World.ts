import Point from "../Values/Point";

interface Categorized {
    kind: string;
}

interface Nullable {
    isNothing: boolean
}

type Thing = Categorized & Nullable
interface Terrain extends Thing {}
interface Doodad extends Thing {
    size: number
}

type State = { [key: string]: any }
interface Stateful {
    state: State
}

interface Describable {
    name: string;
    description: string
}
type Item = Describable & Stateful & Thing

interface LifeForm extends Thing {
    species: string;
}
type Creature = Describable & Stateful & LifeForm

interface Combatant {
    hp: number;
    attackPower: number;
    defense: number;
}

interface CombatResult {
    damaged: boolean;
    damage?: number;
}

type Enemy = Creature & Combatant


abstract class WorldMap<
    E extends Enemy,
    C extends Creature,
    I extends Item,
    D extends Doodad,
    T extends Terrain
> {
    abstract setTerrain(terain: T, position: Point): void;
    abstract putDoodad(doodad: D, position: Point): void;
    abstract placeItem(it: I, position: Point): void;
    abstract spawnCritter(creature: C, position: Point): void;
    abstract spawnEnemy(enemy: E, position: Point): void;

    abstract isBlocked(position: Point, size?: number, checkHalfway?: boolean): boolean;

    abstract listDoodadKinds(): Array<D>;
    abstract listTerrainKinds(): Array<T>;
    abstract listItemKinds(): Array<I>;
    abstract listCritterKinds(): Array<C>;
    abstract listEnemyKinds(): Array<E>;

    abstract getDoodadKindAt(position: Point): D | null;
    abstract getTerrainKindAt(position: Point): T | null;
    abstract getItemKindAt(position: Point): I | null;
    // abstract getCritterAt(position: Point): C | null;
    // abstract getEnemyAt(position: Point): E | null;

    // abstract assembleDoodads(): Array<Array<number>>;
    // abstract assembleItems(): Array<Array<number>>;
    // abstract assembleTerrain(): Array<Array<number>>;

    abstract listItems(): Array<I>;
    abstract findItems(start: Point, end: Point): Array<{ it: I, position: Point }>; 
    // abstract setItemPosition(item: I, position: Point): void;
    abstract getItemPosition(item: I): Point;
    abstract updateItemAt(pos: Point, it: I): void;
    
    abstract listCreatures(): Array<C>;
    abstract findCreatures(start: Point, end: Point): Array<{ it: C, position: Point }>; 
    abstract getCreaturePosition(creature: C): Point;
    abstract setCreaturePosition(creature: C, position: Point): void;

    abstract listEnemies(): Array<E>;
    abstract listEnemyPositions(): Array<Point>;
    abstract findEnemies(start: Point, end: Point): Array<{ it: E, position: Point }>;
    // abstract getEnemyPosition(enemy: E): Point;
    // abstract setEnemyPosition(enemy: E, position: Point): void;
}

abstract class World<
    E extends Enemy,
    C extends Creature,
    I extends Item,
    D extends Doodad,
    T extends Terrain
> {
    abstract get dimensions(): Point;
    abstract get map(): WorldMap<E, C, I, D, T>;

    abstract scan(pos: Point, scanRadius: number): [E | C | I, Point] | null;
    abstract interact(it: I, pos: Point): string;
    abstract attack(enemy: E): CombatResult;

    abstract getPlayerLocation(): Point;
    abstract setPlayerLocation(pos: Point): void;

    abstract ride(creature: C): void;
    abstract dismount(): void;

    abstract updateCreature(creature: C): void;
    abstract updateEnemy(enemy: Enemy): void;
}

export type Worldlike = World<Enemy, Creature, Item, Doodad, Terrain>;
export type Maplike = WorldMap<Enemy, Creature, Item, Doodad, Terrain>;

export { Thing, Terrain, Doodad, Item, Creature, Enemy, WorldMap, CombatResult }
export default World;
