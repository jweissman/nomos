import { Actor, Engine, Events, Vector, Drawable } from "excalibur";
import World, { Terrain, Doodad, Item, Thing, Creature, Enemy } from "../Models/World";
import Point from "../Values/Point";
import { SpriteDict } from "../Values/SpriteDict";

export class GridView<E extends Enemy, C extends Creature, I extends Item, D extends Doodad, T extends Terrain> extends Actor {
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
        private world: World<E, C,I,D,T>,
        private sprites: SpriteDict,
        private player: Actor // Player<E, I, C>
    ) {
        super();
        this.terrainGrid = this.world.map.assembleTerrain();
    }

    public onInitialize() { 
        // this.add(this.player);
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

    draw(ctx: CanvasRenderingContext2D, delta: number) {
        let sz = GridView.cellSize;
        let items = this.world.map.assembleItems();
        let doodads = this.world.map.assembleDoodads();

        let toDraw: { name: string, sprite: Drawable, position: Point, face?: Vector, player?: boolean, yOff?: number }[] = []

        ctx.strokeStyle = 'white';
        this.forEachCell(([ix,iy]) => {
            let location: Point = [ix * sz, iy * sz];
            let [x,y] = location
            let terrain: Drawable | null = this.getSpriteForElement(ctx, [ix,iy], this.terrainGrid, this.world.map.listTerrainKinds())
            if (terrain) {
                terrain.draw(ctx, x, y)
            }
            let item: Drawable | null = this.getSpriteForElement(ctx, [ix,iy], items, this.world.map.listItemKinds())
            if (item) {
                item.draw(ctx, x, y)
            }
            let it: I = this.getElementAtPosition(ctx, [ix, iy], items, this.world.map.listItemKinds()) as I;
            if (it && !it.state.collected) {
                let [px,py] = [ix * GridView.cellSize, iy * GridView.cellSize]
                let radius = 3;
                ctx.beginPath();
                ctx.arc(px + 32, py + 32, radius, 0, 2 * Math.PI);
                ctx.stroke();
            }

            let doodad: Doodad | null = this.getElementAtPosition(ctx, [ix,iy], doodads, this.world.map.listDoodadKinds())
            let doodadSprite: Drawable | null = this.getSpriteForElement(ctx, [ix,iy],doodads, this.world.map.listDoodadKinds())
            if (doodad && doodadSprite) {
                toDraw.push({ name: 'doodad', sprite: doodadSprite, position: [x,y], yOff: 64 + doodad.size * 64 })
                // toDraw.push({ name: 'doodad', sprite: null, position: [x,y] })
            }
       })
        this.forEachVisibleCreature(({creature, position: [ix,iy]}) => { 
            let location: Point = [ix * sz, iy * sz];
            toDraw.push({ name: 'creature', sprite: this.sprites[creature.kind], position: location, face: creature.state.facing })
        })
        this.forEachVisibleEnemy(({ enemy, position: [ix,iy] }) => { 
            let location: Point = [ix * sz, iy * sz];
            toDraw.push({ name: 'enemy', sprite: this.sprites[enemy.kind], position: location, yOff: 100 })
        })

        let [ix,iy] = [this.player.pos.x, this.player.pos.y+78] // + 128]
        let location: Point = [ix, iy];
        toDraw.push({ name: 'player', sprite: this.player.currentDrawing, position: location, player: true })

        toDraw = toDraw.sort((a,b) => {
            let ay = a.position[1] + (!!a.yOff ? a.yOff : 0);
            let by = b.position[1] + (!!b.yOff ? b.yOff : 0);
            return by > ay ? -1 : 1;
        })
        toDraw.forEach(({ sprite, position, face, player }) => {
            if (!!player) {
                this.player.draw(ctx, delta)
            } else {
                this.drawSprite(ctx, sprite, position, face)
            }
        })
    }
   private drawSprite(ctx: CanvasRenderingContext2D, sprite: Drawable, position: Point, face: Vector | null = null): void {
        if (face) {
            let theta = face.normalize().toAngle() + Math.PI / 2;
            let oldAnchor = sprite.anchor
            sprite.anchor = new Vector(0.5, 0.5)
            sprite.rotation = theta;
            sprite.draw(ctx, position[0], position[1]);
            sprite.anchor = oldAnchor
        } else {
            sprite.draw(ctx, position[0], position[1]);
        }
    }
    private getElementAtPosition<T extends Thing>(ctx: CanvasRenderingContext2D, position: Point, elements: Array<Array<number>>, list: T[]): T | null {
        let [ix, iy] = position;
        let itCell = elements[iy][ix];
        if (itCell === -1) { } else {
            let it: T = list[itCell];
            if (it && !it.isNothing) {
                return it;
            }
        }
        return null;
    }
    private getSpriteForElement<T extends Thing>(ctx: CanvasRenderingContext2D, position: Point, elements: Array<Array<number>>, list: T[]): Drawable | null {
        let it: T | null = this.getElementAtPosition<T>(ctx, position, elements, list);
        if (it) {
            let sprite: Drawable = this.sprites[it.kind];
            if (sprite) {
                return sprite;
            } else {
                throw new Error("Could not find sprite for: " + it.kind)
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
        this.world.map.findCreatures([x,y], [xEnd,yEnd]).forEach(
            ({it,position}:{ it: C, position: Point }) => { 
            if (!!it.state.visible) {
                cb({ creature: it, position }); 
            }
        });
    }
    private forEachVisibleEnemy(cb: (c: { enemy: E, position: Point }) => void) {
        let cols = this.terrainGrid.length;
        let rows = this.terrainGrid[0].length;

        let x = this._onScreenXStart;
        const xEnd = Math.min(this._onScreenXEnd, cols);
        let y = this._onScreenYStart;
        const yEnd = Math.min(this._onScreenYEnd, rows);

        this.world.map.findEnemies([x,y], [xEnd,yEnd]).forEach(
            ({it,position}:{ it: E, position: Point }) => { 
                cb({ enemy: it, position }); 
        });
    }
}

export default GridView;