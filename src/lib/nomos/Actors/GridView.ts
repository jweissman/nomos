import { Actor, Engine, Events, Vector, Drawable } from "excalibur";
import World, { Terrain, Doodad, Item, Creature, Enemy } from "../Models/World";
import Point from "../Values/Point";
import { SpriteDict } from "../Values/SpriteDict";

export class GridView<E extends Enemy, C extends Creature, I extends Item, D extends Doodad, T extends Terrain> extends Actor {
    static cellSize: number = 64
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
        private player: Actor
    ) {
        super();
    }

    public update(engine: Engine, delta: number) {
        this.emit('preupdate', new Events.PreUpdateEvent(engine, delta, this));

        const worldCoordsUpperLeft = engine.screenToWorldCoordinates(new Vector(0, 0));
        const worldCoordsLowerRight = engine.screenToWorldCoordinates(new Vector(engine.canvas.clientWidth, engine.canvas.clientHeight));

        this._onScreenXStart = Math.max(Math.floor((worldCoordsUpperLeft.x - this.pos.x) / this.cellWidth) - 2, 0);
        this._onScreenYStart = Math.max(Math.floor((worldCoordsUpperLeft.y - this.pos.y) / this.cellHeight) - 2, 0);
        this._onScreenXEnd = Math.max(Math.floor((worldCoordsLowerRight.x - this.pos.x) / this.cellWidth) + 2, 0);
        this._onScreenYEnd = Math.max(Math.floor((worldCoordsLowerRight.y - this.pos.y) / this.cellHeight) + 2, 0);

        ///
        // this.forEachVisibleEnemy(({ enemy, position: [ix,iy] }) => { 
            // let location: Point = [ix * sz, iy * sz];
            // toDraw.push({ name: 'enemy', sprite: this.sprites[enemy.kind], position: location, yOff: 12 })
        // })


        // if (this.)

        this.emit('postupdate', new Events.PostUpdateEvent(engine, delta, this));
    }

    draw(ctx: CanvasRenderingContext2D, delta: number) {
        let sz = GridView.cellSize;
        let toDraw: {
            name: string,
            sprite: Drawable,
            position: Point,
            face?: Vector,
            player?: boolean,
            yOff?: number,
            flip?: boolean,
        }[] = []
        ctx.strokeStyle = 'white';
        this.forEachCell(([ix,iy]) => {
            let location: Point = [ix * sz, iy * sz];
            let [x,y] = location
            let terrain: Terrain | null = this.world.map.getTerrainKindAt([ix,iy])
            if (terrain) {
                let terrainSprite: Drawable | null = this.sprites[terrain.kind];
                terrainSprite.draw(ctx, x, y)
            }

            let item: Item | null = this.world.map.getItemKindAt([ix,iy])
            if (item) {
                let itemSprite: Drawable | null = this.sprites[item.kind]
                itemSprite.draw(ctx, x, y)
                if (!item.state.collected) {
                    let [px, py] = [ix * GridView.cellSize, iy * GridView.cellSize]
                    let radius = 3;
                    ctx.beginPath();
                    ctx.arc(px + 32, py + 32, radius, 0, 2 * Math.PI);
                    ctx.stroke();
                }
            }

            let doodad: Doodad | null = this.world.map.getDoodadKindAt([ix,iy]);
            if (doodad) {
                let doodadSprite: Drawable | null = this.sprites[doodad.kind];
                toDraw.push({ name: 'doodad', sprite: doodadSprite, position: [x, y], yOff: 2 + doodad.size * 33 })
            }
        })
        this.forEachVisibleCreature(({creature, position: [ix,iy]}) => { 
            let location: Point = [ix * sz, iy * sz];
            toDraw.push({ name: 'creature', sprite: this.sprites[creature.kind], position: location, face: creature.state.facing, yOff: -36 })
        })
        this.forEachVisibleEnemy(({ enemy, position: [ix,iy] }) => { 
            let location: Point = [ix * sz, iy * sz];
            let sprite = this.sprites[enemy.kind];
            if (enemy.state.hp > 0) { //dead) {
                // console.log("enemy state: ", enemy.state.facing)
            }
            
            let flip = false;
            if (enemy.state.facing.x > 0) {
                flip = true;
            }

            let show = true
            if (enemy.state.gotHit) {
                if (enemy.state.hp > 0 && Math.random()<0.5) {
                    show = false
                }
            }
            if (show) {
                toDraw.push({ name: 'enemy', sprite, position: location, yOff: 12, flip })
            }
        })

    let [ix, iy] =[this.player.pos.x, this.player.pos.y] //+78];
        let location: Point = [ix, iy];
        toDraw.push({ name: 'player', sprite: this.player.currentDrawing, position: location, player: true, yOff: -16 })

        toDraw = toDraw.sort((a,b) => {
            let ay = a.position[1] + (!!a.yOff ? a.yOff : 0);
            let by = b.position[1] + (!!b.yOff ? b.yOff : 0);
            return by > ay ? -1 : 1;
        })
        toDraw.forEach(({ sprite, position, face, player, flip }) => {
            if (!!player) {
                this.player.draw(ctx, delta)
            } else {
                if (sprite) {
                    this.drawSprite(ctx, sprite, position, face, flip)
                } else {
                    console.log("No sprite for " + sprite)
                }
            }
        })

        this.forEachVisibleEnemy(({ enemy, position: [ix,iy] }) => { 
            if (enemy.state.hp > 0 && enemy.state.hp < enemy.hp) {
                let sz = GridView.cellSize;;
                ctx.clearRect(sz * ix, sz * iy - 20, sz, 4)
                let hp = enemy.state.hp / enemy.hp 
                let hpMeter: [number, number,number,number] = [sz * ix + 1, sz * iy - 19, Math.floor(sz * hp)-1, 2]
                ctx.fillStyle=enemy.state.hp > 10 ? 'green' : 'red'
                ctx.fillRect(...hpMeter)
            }
        });
    }

    private drawSprite(ctx: CanvasRenderingContext2D, sprite: Drawable, position: Point, face: Vector | null = null, flip: boolean = false): void {
        //if (flip) {
        //    console.log("FLIP")
        //    sprite.flipHorizontal = true;

        //} else {
        //    sprite.flipHorizontal = false;
        // @ts-ignore
        if (sprite.sprites) {
            //@ts-ignore
            sprite.sprites.forEach(sprite => sprite.flipHorizontal = flip)
        } else {
            sprite.flipHorizontal = flip;
        }
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

    private forEachCell(cb: (p: Point) => void) {
        let cols = this.world.dimensions[0];
        let rows = this.world.dimensions[1];
        let x = this._onScreenXStart;
        const xEnd = Math.min(this._onScreenXEnd, cols);
        let y = this._onScreenYStart;
        const yEnd = Math.min(this._onScreenYEnd, rows);
        for (let ix = x; ix < xEnd; ix++) {
            for (let iy = y; iy < yEnd; iy++) {
                cb([ix, iy]);
            }
        }
    }
    public forEachVisibleCreature(cb: (c: { creature: C, position: Point }) => void) {
        let cols = this.world.dimensions[0];
        let rows = this.world.dimensions[1];
        let x = this._onScreenXStart;
        const xEnd = Math.min(this._onScreenXEnd, cols);
        let y = this._onScreenYStart;
        const yEnd = Math.min(this._onScreenYEnd, rows);
        this.world.map.findCreatures([x, y], [xEnd, yEnd]).forEach(
            ({ it, position }: { it: C, position: Point }) => {
                if (!!it.state.visible) {
                    cb({ creature: it, position });
                }
            });
    }
    public forEachVisibleEnemy(cb: (c: { enemy: E, position: Point }) => void) {
        let cols = this.world.dimensions[0];
        let rows = this.world.dimensions[1];
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