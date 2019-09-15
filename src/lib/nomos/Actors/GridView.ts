import { Actor, Sprite, Engine, Events, Vector, Effects } from "excalibur";
import { World, Terrain, Doodad, Item, Thing, Creature } from "../Models/World";
import Point from "../Values/Point";

export class GridView<C extends Creature, I extends Item, D extends Doodad, T extends Terrain> extends Actor {
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
        private world: World<C,I,D,T>,
        private sprites: { [key: string]: Sprite },
        // private highlightItems: boolean = false,
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
        ctx.strokeStyle = 'white';
        this.forEachCell(([ix,iy]) => {
            this.drawElement(ctx, [ix,iy], this.terrainGrid, this.world.listTerrainKinds());
            this.drawElement(ctx, [ix,iy], doodads, this.world.listDoodads());
            let it = this.drawElement(ctx, [ix,iy], items, this.world.listItems());
            if (it && !it.state.collected) {
                let [x,y] = [ix * GridView.cellSize, iy * GridView.cellSize]
                let radius = 3;
                ctx.beginPath();
                ctx.arc(x + 32, y + 32, radius, 0, 2 * Math.PI);
                ctx.stroke();
            }
       })

        this.forEachVisibleCreature(({creature, position}) => { 
            this.drawCreature(ctx, position, creature);
        })
    }

    // private getKindIndex<T extends Thing>(position: Point, elements: Array<Array<number>>, kinds: T[]): number | null {
    //     let [ix, iy] = position;
    //     let itCell = elements[iy][ix];
    //     if (itCell === -1) {
    //         // ctx.fillStyle = 'white'
    //         // ctx.fillRect(ix*GridView.cellSize,iy*GridView.cellSize,10,10)
    //     } else {
    //         let it: T = kinds[itCell];
    //         if (it && !it.isNothing) {
    //             return kinds.indexOf(it);
    //         }
    //     }
    //     return null;
    // }

    private drawCreature<C extends Creature>(ctx: CanvasRenderingContext2D, position: Point, creature: C): void {
        let [ix,iy] = position;
        let sprite: Sprite = this.sprites[creature.kind];
        if (sprite) {
            // let sz = GridView.cellSize;
            let location: Point = [ix,iy] // * sz, iy * sz];
            if (creature.state.facing) {
                // sprite.anchor = new Vector(ix+32,iy+32)
                let face: Vector = creature.state.facing
                let theta = face.normalize().toAngle() + Math.PI / 2;

                // console.log("WOULD ROTATE", { theta }) 
                let oldAnchor = sprite.anchor
                sprite.anchor = new Vector(0.5,0.5)
                sprite.rotation = theta; //creature.state.facing //.toAngle() + Math.PI / 2;
                // sprite.addEffect(Effects.)
                // ctx.save()
                // ctx.rotate(theta)
                sprite.draw(ctx, location[0], location[1]);
                sprite.anchor = oldAnchor
                // ctx.restore()
            } else {
                sprite.draw(ctx, location[0], location[1]);
            }
        } else {
            console.error("Could not find sprite for: " + creature.kind)
        }
    }



    private drawElement<T extends Thing>(ctx: CanvasRenderingContext2D, position: Point, elements: Array<Array<number>>, list: T[]): T | null {
        let [ix, iy] = position;
        let itCell = elements[iy][ix];
        if (itCell === -1) {
            // ctx.fillStyle = 'white'
            // ctx.fillRect(ix*GridView.cellSize,iy*GridView.cellSize,10,10)
        } else {
            let it: T = list[itCell];
            if (it && !it.isNothing) {
                let sprite: Sprite = this.sprites[it.kind];
                if (sprite) {
                    let sz = GridView.cellSize;
                    let location: Point = [ix * sz, iy * sz];
                    sprite.draw(ctx, location[0], location[1]);
                    return it;
                } else {
                    console.error("Could not find sprite for: " + it.kind)
                }
            }
        }
        return null;
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

    public forEachVisibleCreature(cb: (c: {creature: C, position: Point}) => void) {
        let cols = this.terrainGrid.length;
        let rows = this.terrainGrid[0].length;

        let x = this._onScreenXStart;
        const xEnd = Math.min(this._onScreenXEnd, cols);
        let y = this._onScreenYStart;
        const yEnd = Math.min(this._onScreenYEnd, rows);

        this.world.findCreatures([x,y], [xEnd,yEnd]).forEach(cb);
    }
}

export default GridView;