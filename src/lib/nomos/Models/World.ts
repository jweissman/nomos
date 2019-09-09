import Point from "../Values/Point";

interface Categorized {
    kind: string
}

interface Nullable {
    isNothing: boolean
}

type Thing = Categorized & Nullable
interface Terrain extends Thing {}
interface Doodad extends Thing {}

type ItemState = { [key: string]: any }
interface Item extends Thing {
    description: string
    state: ItemState
}

abstract class World<I extends Item, D extends Doodad, T extends Terrain> {
    abstract get dimensions(): Point;

    abstract putDoodad(value: number, position: Point): void;
    abstract setTerrain(value: number, position: Point): void;
    abstract placeItem(it: Item, position: Point): void;

    abstract isBlocked(position: Point): boolean;

    abstract listDoodads(): Array<D>;
    abstract listItems(): Array<I>;
    abstract listTerrainKinds(): Array<T>;

    abstract assembleDoodads(): Array<Array<number>>;
    abstract assembleItems(): Array<Array<number>>;
    abstract assembleTerrain(): Array<Array<number>>;

    abstract scan(pos: Point, scanRadius: number): [I, Point] | null;
    abstract interact(it: Item, pos: Point): string;
}

export { Thing, Terrain, Doodad, Item, World }
