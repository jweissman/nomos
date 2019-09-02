import Point from "../Values/Point";

interface Entity {
    kind: string
    isNothing: boolean
}

abstract class World<T extends Entity> {
    abstract put(value: number, position: Point): void;
    abstract assembleGrid(): Array<Array<number>>;
    abstract listEntities(): Array<T>;
}

export { Entity, World }

