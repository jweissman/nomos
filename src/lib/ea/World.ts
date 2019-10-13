import Point from "../nomos/Values/Point";
import Dialogue from "./Dialogue";

interface Categorized {
    kind: string;
}

interface Nullable {
    isNothing: boolean
}

interface Named {
    name: string
}

type Thing = Categorized & Nullable & Named
interface Terrain extends Thing {}
interface Doodad extends Thing {
    size: number
    halfWidth: boolean
}

type State = { [key: string]: any }
interface Stateful {
    state: State
}

interface Describable {
    name: string;
    description: string
}

interface Interactable {
    interact: () => string[]
}

type Item = Describable & Stateful & Thing & Interactable

interface LifeForm extends Thing {
    species: string;
}
type Creature = Describable & Stateful & LifeForm & {
    isTame: boolean
    hops: boolean
    rotateSprite: boolean
}

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

type Person = Describable & Stateful & LifeForm & {
    says: Dialogue
}

abstract class WorldMap<
    E extends Enemy,
    C extends Creature,
    I extends Item,
    D extends Doodad,
    T extends Terrain,
    P extends Person,
> {
    abstract dimensions: Point;

    abstract setTerrain(terain: T, position: Point): void;
    abstract putDoodad(doodad: D, position: Point): void;
    abstract placeItem(it: I, position: Point): void;
    abstract spawnCritter(creature: C, position: Point): void;
    abstract spawnEnemy(enemy: E, position: Point): void;
    abstract spawnPerson(person: P, position: Point): void;

    abstract isBlocked(position: Point, size?: number, checkHalfway?: boolean): boolean;

    abstract listDoodadKinds(): Array<D>;
    abstract listTerrainKinds(): Array<T>;
    abstract listItemKinds(): Array<I>;
    abstract listCritterKinds(): Array<C>;
    abstract listEnemyKinds(): Array<E>;
    abstract listPeopleKinds(): Array<P>;
    abstract removeDoodad(point: Point): void;

    abstract getDoodadKindAt(position: Point): D | null;
    abstract getTerrainKindAt(position: Point): T | null;
    abstract getItemKindAt(position: Point): I | null;
    abstract getPersonKindAt(position: Point): P | null;

    abstract listItems(): Array<I>;
    abstract findItems(start: Point, end: Point): Array<{ it: I, position: Point }>; 
    abstract getItemPosition(item: I): Point;
    abstract updateItemAt(pos: Point, it: I): void;
    
    abstract listCreatures(): Array<C>;
    abstract findCreatures(start: Point, end: Point): Array<{ it: C, position: Point }>; 
    abstract getCreaturePosition(creature: C): Point;
    abstract setCreaturePosition(creature: C, position: Point): void;

    abstract listEnemies(): Array<E>;
    abstract findEnemies(start: Point, end: Point): Array<{ it: E, position: Point }>;
    abstract getEnemyPosition(enemy: E): Point;
    abstract setEnemyPosition(enemy: E, position: Point): void;

    abstract listPeople(): Array<P>;
    abstract findPeople(start: Point, end: Point): Array<{ it: P, position: Point }>;
    abstract getPersonPosition(person: P): Point;
    abstract setPersonPosition(person: P, position: Point): void;
}

interface Investigable {
    location: Point;
    clueLocations: Point[];
}

export class Wonder implements Describable, Investigable {
    location: [number, number] = [-1,-1];
    clueLocations: [number, number][] = [];
    constructor(public name: string, public description: string) {}
}

type Seek<T> = {
    kind: 'seek',
    goal: T,
}

export const seekWonder: (w: Wonder) => Seek<Wonder> = (wonder: Wonder) => {
    return { kind: 'seek', goal: wonder }
}

export type Quest = Seek<Wonder | Item>

export interface Playerlike {
    hp: number;
    quests: Quest[];
    activeQuest: Quest | null;
    location: Point;
}

export type Maplike = WorldMap<Enemy, Creature, Item, Doodad, Terrain, Person>;

abstract class World<
    E extends Enemy,
    C extends Creature,
    I extends Item,
    D extends Doodad,
    T extends Terrain,
    P extends Person,
> {
    abstract get dimensions(): Point;
    abstract get map(): WorldMap<E, C, I, D, T, P>;

    abstract scan(pos: Point, scanRadius: number): [E | C | I | P, Point] | null;
    abstract interact(it: I | P | C, pos: Point): string[];
    abstract attack(enemy: E, type: 'light' | 'heavy'): CombatResult;

    abstract getPlayerLocation(): Point;
    abstract setPlayerLocation(pos: Point): void;

    abstract givePlayerQuest(q: Quest): void;
    abstract completeQuest(q: Quest): void;
    abstract get currentPlayerQuest(): Quest;

    abstract ride(creature: C): void;
    abstract dismount(): void;

    abstract updateCreature(creature: C): void;
    abstract updateEnemy(enemy: E): void;
    abstract updatePerson(person: P): void;
    abstract updatePlayer(): void;
}

export type Worldlike = World<Enemy, Creature, Item, Doodad, Terrain, Person>;

export { Thing, Terrain, Doodad, Item, Creature, Enemy, Person, WorldMap, CombatResult }
export default World;
