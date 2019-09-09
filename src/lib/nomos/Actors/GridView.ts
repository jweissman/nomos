import { Actor, Sprite, Engine, Events, Vector } from "excalibur";
import { World, Terrain, Doodad, Item, Thing } from "../Models/World";
import Point from "../Values/Point";
import { TheniaDoodad, TheniaTerrain, TheniaItem } from "../Models/Thenia";

export class GridView<I extends Item, D extends Doodad, T extends Terrain> extends Actor {
    static cellSize: number = 64
    terrainGrid: number[][];
    cellWidth: number = GridView.cellSize;
    cellHeight: number = GridView.cellSize;
    _onScreenXStart: number = 0;
    _onScreenYStart: number = 0;
    _onScreenXEnd: number = 100;
    _onScreenYEnd: number = 100;
    lastMappedEntityGrid: any;

    constructor(
        private world: World<I, D, T>,
        private sprites: { [key: string]: Sprite }
    ) {
        super();
        this.terrainGrid = this.world.assembleTerrain();
    }

    public update(engine: Engine, delta: number) {
        this.emit('preupdate', new Events.PreUpdateEvent(engine, delta, this));

        const worldCoordsUpperLeft = engine.screenToWorldCoordinates(new Vector(0, 0));
        const worldCoordsLowerRight = engine.screenToWorldCoordinates(new Vector(engine.canvas.clientWidth, engine.canvas.clientHeight));

        this._onScreenXStart = Math.max(Math.floor((worldCoordsUpperLeft.x - this.pos.x) / this.cellWidth) - 2, 0);
        this._onScreenYStart = Math.max(Math.floor((worldCoordsUpperLeft.y - this.pos.y) / this.cellHeight) - 2, 0);
        this._onScreenXEnd = Math.max(Math.floor((worldCoordsLowerRight.x - this.pos.x) / this.cellWidth) + 2, 0);
        this._onScreenYEnd = Math.max(Math.floor((worldCoordsLowerRight.y - this.pos.y) / this.cellHeight) + 2, 0);

        this.emit('postupdate', new Events.PostUpdateEvent(engine, delta, this));
    }

    draw(ctx: CanvasRenderingContext2D) {
        let items = this.world.assembleItems();
        let doodads = this.world.assembleDoodads();
        // console.log({items})
        this.forEachCell(([ix,iy]) => {
            this.drawElement(ctx, [ix,iy], this.terrainGrid, this.world.listTerrainKinds());
            this.drawElement(ctx, [ix,iy], doodads, this.world.listDoodads());
            this.drawElement(ctx, [ix,iy], items, this.world.listItems());
        })
    }

    private drawElement<T extends Thing>(ctx: CanvasRenderingContext2D, position: Point, elements: Array<Array<number>>, list: T[]) {
        let [ix,iy] = position;
        let itCell = elements[iy][ix];
        let it: T = list[itCell];
        if (it && !it.isNothing) {
            let sprite: Sprite = this.sprites[it.kind];
            if (sprite) {
                let sz = GridView.cellSize;
                let location: Point = [ix * sz, iy * sz];
                sprite.draw(ctx, location[0], location[1]);
            } else {
                console.error("Could not find sprite for: " + it.kind)
            }
        }
    }

    private forEachCell(cb: (p: Point) => void) {
        let cols = this.terrainGrid.length;
        let rows = this.terrainGrid[0].length;

        let x = this._onScreenXStart;
        const xEnd = Math.min(this._onScreenXEnd, cols);
        let y = this._onScreenYStart;
        const yEnd = Math.min(this._onScreenYEnd, rows);

        for (let ix = x; ix < xEnd; ix++) {
            for (let iy = y; iy < yEnd; iy++) {
                cb([ix,iy]);
            }
        }
    }
}

export type TheniaView = GridView<TheniaItem, TheniaDoodad, TheniaTerrain>
export default GridView;