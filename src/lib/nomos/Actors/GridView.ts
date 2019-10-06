import { Actor, Engine, Events, Vector, Drawable } from "excalibur";
import World, { Terrain, Doodad, Item, Creature, Enemy } from "../../ea/World";
import Point from "../Values/Point";
import { SpriteDict } from "../Values/SpriteDict";

type DrawnEntity = {
    name: string,
    sprite: Drawable,
    position: Point,
    face?: Vector,
    player?: boolean,
    xOff?: number,
    yOff?: number,
    zOff?: number,
    flip?: boolean,
}

// basic grid view is 'pure ea' 
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
        private world: World<E, C, I, D, T>,
        private sprites: SpriteDict,
        private player: Actor
    ) {
        super();
    }

    public update(engine: Engine, delta: number) {
        this.emit('preupdate', new Events.PreUpdateEvent(engine, delta, this));

        const origin = engine.screenToWorldCoordinates(new Vector(0, 0));
        const lowerRight = engine.screenToWorldCoordinates(new Vector(engine.canvas.clientWidth, engine.canvas.clientHeight));

        this._onScreenXStart = (Math.floor((origin.x - this.pos.x) / this.cellWidth) - 1);
        this._onScreenYStart = (Math.floor((origin.y - this.pos.y) / this.cellHeight) - 1);
        this._onScreenXEnd = (Math.floor((lowerRight.x - this.pos.x) / this.cellWidth) + 1);
        this._onScreenYEnd = (Math.floor((lowerRight.y - this.pos.y) / this.cellHeight) + 1);

        this.emit('postupdate', new Events.PostUpdateEvent(engine, delta, this));
    }

    get frame(): [Point,Point] {
        return this.buildFrame();
   }

    buildFrame(pad: number=0): [Point,Point] {
        let x = this._onScreenXStart;
        const xEnd = this._onScreenXEnd;
        let y = this._onScreenYStart;
        const yEnd = this._onScreenYEnd;
        let frame: [Point,Point] = [
            [x-pad,y-pad],
            [xEnd+pad,yEnd+pad]
        ];
        return frame
    }

    createdAt: number = new Date().getTime();
    draw(ctx: CanvasRenderingContext2D, delta: number) {
        let sz = GridView.cellSize;
        let toDraw: DrawnEntity[] = []
        ctx.strokeStyle = 'white';
        this.forEachCell(([ix,iy]) => { this.drawCell(ctx, [ix, iy]) })
        this.forEachCell(([ix,iy]) => {
            let [x,y] = [ ix * sz, iy * sz ]
            let doodad: Doodad | null = this.world.map.getDoodadKindAt([ix, iy]);
            if (doodad) {
                let doodadSprite: Drawable | null = this.sprites[doodad.kind];
                let xOff = 0;
                let yOff = -48 + doodad.size * 64;
                if (doodad.halfWidth) { xOff = -sz/2 }
                toDraw.push({ name: 'doodad', sprite: doodadSprite, position: [x, y], zOff: yOff, xOff })
            }
        }, { pad: 2 })


        this.forEachVisibleCreature(({ creature, position: [ix, iy] }) => {
            let location: Point = [ix * sz, iy * sz];
            let zOff = -36;
            let yOff = 0;
            if (creature.hops) { 
                let now = new Date().getTime();
                let cycleTime = 700
                let jumpHeight = 16
                let delta = (now - this.createdAt) % cycleTime;
                yOff = -Math.abs(Math.sin(2 * Math.PI * (delta / cycleTime))) * jumpHeight;
                zOff += 20;
            }
            toDraw.push({
                name: 'creature',
                sprite: this.sprites[creature.kind],
                position: location,
                ...(creature.rotateSprite
                    ? { face: creature.state.facing }
                    : { flip: creature.state.facing && creature.state.facing.x > 0 }
                ),
                yOff,
                zOff, //: -36,
                
            })
        })
        this.forEachVisibleEnemy(({ enemy, position: [ix, iy] }) => {
            let location: Point = [ix * sz, iy * sz];
            let sprite = this.sprites[enemy.kind];
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
                toDraw.push({ name: 'enemy', sprite, position: location, zOff: 12, flip })
            }
        })

        let [ix, iy] = [this.player.pos.x, this.player.pos.y];
        let location: Point = [ix, iy];
        toDraw.push({ name: 'player', sprite: this.player.currentDrawing, position: location, player: true, zOff: -16 })

        toDraw = toDraw.sort((a,b) => {
            let ay = a.position[1] + (!!a.zOff ? a.zOff : 0);
            let by = b.position[1] + (!!b.zOff ? b.zOff : 0);
            let res = by > ay ? -1 : 1;
            return res
        })
        toDraw.forEach(({ sprite, name, position, face, player, flip, xOff, yOff, zOff }) => {
            if (!!player) {
                this.player.draw(ctx, delta)
            } else {
                if (sprite) {
                    let [x,y] = position
                    xOff = xOff || 0
                    yOff = yOff || 0
                    this.drawSprite(ctx, sprite, [x+xOff, y+yOff], face, flip)
                } else {
                    throw new Error("No sprite for " + sprite)
                }
            }
        })

        this.forEachVisibleEnemy(({ enemy, position: [ix,iy] }) => { 
            if (enemy.state.hp > 0 && enemy.state.hp < enemy.hp) {
                let sz = GridView.cellSize;;
                ctx.fillStyle = 'black'
                ctx.fillRect(sz * ix, sz * iy - 20, sz, 4)
                let hp = enemy.state.hp / enemy.hp 
                let hpMeter: [number, number,number,number] = [sz * ix + 1, sz * iy - 19, Math.floor(sz * hp)-1, 2]
                ctx.fillStyle=enemy.state.hp > (0.5 * enemy.hp) ? 'green' : 'red'
                ctx.fillRect(...hpMeter)
            }
        });
    }

    private drawCell(ctx: CanvasRenderingContext2D, [ix,iy]: Point): void {
        let sz = GridView.cellSize;
        let location: Point = [ix * sz, iy * sz];
        let [x, y] = location
        let terrain: Terrain | null = this.world.map.getTerrainKindAt([ix, iy])
        if (terrain) {
            let terrainSprite: Drawable | null = this.sprites[terrain.kind];
            terrainSprite.draw(ctx, x, y)

        }

        let item: Item | null = this.world.map.getItemKindAt([ix, iy])
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

        let debugBlocked = false;
        if (debugBlocked) {
            if (this.world.map.isBlocked([ix, iy])) {
                let radius = 8;
                ctx.beginPath();
                ctx.arc(x + 32, y + 64, radius, 0, 2 * Math.PI);
                ctx.stroke();
            }
        }
    }

    private drawSprite(ctx: CanvasRenderingContext2D, sprite: Drawable, position: Point, face: Vector | null = null, flip: boolean = false): void {
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

    private forEachCell(cb: (p: Point) => void, opts?: { pad: number }) {
        let pad = opts && opts.pad || 0;
        let [fStart, fEnd] = this.buildFrame(pad);
        let [x,y] = fStart;
        let [xEnd,yEnd] = fEnd;
        for (let ix = x; ix < xEnd; ix++) {
            for (let iy = y; iy < yEnd; iy++) {
                cb([ix, iy]);
            }
        }
    }
    public forEachVisibleCreature(
        cb: (c: { creature: C, position: Point }) => void,
        pad: number = 8
    ) {
        let [fStart, fEnd] = this.buildFrame(pad);
        let [x,y] = fStart;
        let [xEnd,yEnd] = fEnd;
        this.world.map.findCreatures([x, y], [xEnd, yEnd]).forEach(
            ({ it, position }: { it: C, position: Point }) => {
                if (!!it.state.visible) {
                    cb({ creature: it, position });
                }
            });
    }
    public forEachVisibleEnemy(cb: (c: { enemy: E, position: Point }) => void) {
        let [fStart, fEnd] = this.buildFrame();
        let [x,y] = fStart;
        let [xEnd,yEnd] = fEnd;
        this.world.map.findEnemies([x,y], [xEnd,yEnd]).forEach(
            ({it,position}:{ it: E, position: Point }) => { 
                cb({ enemy: it, position }); 
        });
    }
}

export default GridView;