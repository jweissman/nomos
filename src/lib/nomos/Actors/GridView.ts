import { Actor, Sprite } from "excalibur";

import Point from "../Values/Point";
import { World, Entity } from "../Models/World";

type SpritePin = [Point,Sprite]

class GridView<T extends Entity> extends Actor {
    cellSize: number = 50
    gridMap: SpritePin[] = []
    lastMappedGrid: Array<Array<number>> = []

    constructor(
        private world: World<T>,
        private sprites: { [key: string]: Sprite }
    ) {
        super();
    }

    update() {
        let worldGrid = this.world.assembleGrid();
        if (worldGrid != this.lastMappedGrid) {
            this.lastMappedGrid = worldGrid;
            this.gridMap = this.mapGrid(worldGrid);
        }
    }

    private mapGrid(grid: Array<Array<number>>) {
        let sz = this.cellSize;
        let offset = [100,100];
        let newGridMap: SpritePin[] = []
        let entities = this.world.listEntities();
        grid.forEach((row, y) => {
            row.forEach((cell, x) => {
                let thing: T = entities[cell];
                if (thing && !thing.isNothing) {
                    let location: Point = [offset[0] + sz * x, offset[1] + sz * y]
                    let sprite = this.sprites[thing.kind];
                    newGridMap.push([location, sprite])
                }
            })
        })
        return newGridMap;
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.gridMap.forEach(([pos, sprite]) => { 
            let [sx, sy] = pos
            sprite.draw(ctx, sx, sy);
        })
    }
}

export default GridView;