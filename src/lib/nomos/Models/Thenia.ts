import Point from "../Values/Point";
import { Entity, World } from "./World";
import { iota } from "../../util/iota";

interface Nothing extends Entity {
    kind: 'nothing'
    isNothing: true
}

interface BasicEntity extends Entity {
    isNothing: false
}

interface Tree extends BasicEntity {
    kind: 'tree'
}

export const tree: () => Tree = () => { return { kind: 'tree', isNothing: false } }
export const zed: () => Nothing = () => { return { kind: 'nothing', isNothing: true } }

export type TheniaObject = Nothing | Tree

class Thenia extends World<TheniaObject> {
    grid: Array<Array<number>>;
    constructor({ dimensions }: { dimensions: Point } = {
        dimensions: [4,4]
    }) {
        super();
        let [m,n] = dimensions;
        this.grid = [];
        iota(m-1).forEach(y => {//iota(n).forEach((y) => {
            this.grid[y] = Array(n)
            this.grid[y].fill(0,0,n)
        })
    }
    entities: TheniaObject[] = [
        zed(),
        tree(),
        // tree(),
        // tree(),
    ];
    put(value: number, position: Point): void {
        let [x, y] = position;
        this.grid[y][x] = value // this.entities.indexOf(value);
    }
    assembleGrid(): number[][] {
        return this.grid;
    }
    listEntities(): TheniaObject[] {
        return this.entities;
    }
}

export default Thenia;