import Dialogue from "./Dialogue";
import Point from "../nomos/Values/Point";
import { Wonder } from "./Wonder";
import { WorldMap } from "./World";

interface Categorized {
    kind: string;
}

interface Nullable {
    isNothing: boolean;
}

interface Named {
    name: string;
}

export type Thing = Categorized & Nullable & Named;
export type Terrain = Thing;

export interface Doodad extends Thing {
    size: number;
    halfWidth: boolean;
}

export interface State { [key: string]: any; }

export interface Stateful {
    state: State;
}

export interface Describable {
    name: string;
    description: string;
}

export interface Interactable {
    interact: () => string[];
}

export type Item = Describable & Stateful & Thing & Interactable;

export interface LifeForm extends Thing {
    species: string;
}
export type Creature = Describable & Stateful & LifeForm & {
    isTame: boolean
    hops: boolean
    rotateSprite: boolean;
};

export interface Combatant {
    hp: number;
    attackPower: number;
    defense: number;
}

export interface CombatResult {
    damaged: boolean;
    damage?: number;
}

export type Enemy = Creature & Combatant;

export type Person = Describable & Stateful & LifeForm & {
    says: Dialogue,
};

export interface Investigable {
    location: Point;
    clueLocations: Point[];
}

export interface Seek<T> {
    kind: "seek";
    goal: T;
}

export type Quest = Seek<Wonder | Item>;

export interface Playerlike {
    hp: number;
    quests: Quest[];
    activeQuest: Quest | null;
    location: Point;
}

export type Maplike = WorldMap<Enemy, Creature, Item, Doodad, Terrain, Person>;

