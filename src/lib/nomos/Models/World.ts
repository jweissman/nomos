import Point from "../Values/Point";

// type Rarity = 'common' | 'uncommon' | 'rare' | 'legendary'
// type Beauty = 'quiet' | 'pure' | 'perfect' | 'sublime'
// type Skill = 'primitive' | 'average' | 'sophisticated' | 'exceptional'
// type Delivery = 'prompt' | 'eloquent' | 'concise' | 'expressive' | 'overlong'
// type Quality = Beauty | Skill

interface Categorized {
    kind: string;
}

interface Nullable {
    isNothing: boolean
}


type Thing = Categorized & Nullable
interface Terrain extends Thing {}
interface Doodad extends Thing {}

type State = { [key: string]: any }
interface Stateful {
    state: State
}

interface Describable {
    name: string;
    description: string
    // rarity: Rarity;
    // quality: Quality;
}
type Item = Describable & Stateful & Thing // & Locatable

// type CreatureSize = 'tiny' | 'small' | 'medium' | 'large'
interface LifeForm extends Thing {
    species: string;
    // visible: boolean;
}
    // size: CreatureSize;
    // level: number;
    // rarity: Rarity;
    // quality: Quality;
    // role: string;
    // // speed: number;
    // power: number;
    // dodge: number;
    // toughness: number;
// }
type Creature = Describable & Stateful & LifeForm

abstract class World<C extends Creature, I extends Item, D extends Doodad, T extends Terrain> {
    abstract get dimensions(): Point;

    abstract setTerrain(value: number, position: Point): void;
    abstract putDoodad(doodad: Doodad, position: Point): void;
    abstract placeItem(it: Item, position: Point): void;
    abstract spawnCritter(creature: Creature, position: Point): void;

    abstract isBlocked(position: Point): boolean;

    abstract listDoodads(): Array<D>;
    abstract listItems(): Array<I>;
    abstract listTerrainKinds(): Array<T>;
    abstract listCritterKinds(): Array<C>;

    abstract assembleDoodads(): Array<Array<number>>;
    abstract assembleItems(): Array<Array<number>>;
    abstract assembleTerrain(): Array<Array<number>>;
    // abstract assembleCritters(): Array<Array<number>>;

    abstract listCreatures(): Array<C>;
    abstract findCreatures(start: Point, end: Point): Array<{ creature: C, position: Point }>; 

    abstract scan(pos: Point, scanRadius: number): [I | C, Point] | null;
    abstract interact(it: Item, pos: Point): string;
}

export { Thing, Terrain, Doodad, Item, World, Creature }
