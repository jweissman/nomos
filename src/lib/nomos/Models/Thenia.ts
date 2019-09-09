import Point from "../Values/Point";
import { World, Terrain, Thing, Doodad, Item } from "./World";
import { iota } from "../../util/iota";
import GridView from "../Actors/GridView";

const distance = (a: Point, b: Point) => { 
    let [ax,ay] = a;
    let [bx,by] = b;
    return Math.sqrt( (ax - bx)*(ax - bx) + (ay - by)*(ay - by));
}

interface Nothing extends Thing {
    kind: 'nothing'
    isNothing: true
}

export const zed: () => Nothing = () => { return { kind: 'nothing', isNothing: true } }

interface SimpleDoodad extends Doodad {
    isNothing: false
    canBeGathered: false
}

interface Tree extends SimpleDoodad {
    kind: 'tree'
}

interface Rock extends SimpleDoodad {
    kind: 'rock'
}

interface Shrub extends SimpleDoodad {
    kind: 'shrub'
}

export const tree: () => Tree = () => { return { kind: 'tree', isNothing: false, canBeGathered: false } }
export const rock: () => Rock = () => { return { kind: 'rock', isNothing: false, canBeGathered: false } }
export const shrub: () => Shrub = () => { return { kind: 'shrub', isNothing: false, canBeGathered: false }}

export type TheniaDoodad = Nothing | Tree | Rock | Shrub

interface Dirt extends Terrain {
    kind: 'dirt'
}
interface Grass extends Terrain {
    kind: 'grass'
}
interface Water extends Terrain {
    kind: 'water'
}

export const dirt: () => Dirt = () => { return { kind: 'dirt', isNothing: false }}
export const grass: () => Grass = () => { return { kind: 'grass', isNothing: false }}
export const water: () => Water = () => { return { kind: 'water', isNothing: false }}

export type TheniaTerrain = Nothing | Dirt | Grass | Water

export class TheniaItem implements Item {
    state: { [key: string]: any; } = {};

    static none = () => new TheniaItem('nothing', 'not a thing', {}, '', true)
    static coin = (state: { [key: string]: any} = {}) => new TheniaItem('coin', 'It glitters sharply', state, 'coinCollected')
    static root = (state: { [key: string]: any} = {}) => new TheniaItem('root', 'A gnarled survivor', state, 'rootGathered')

    constructor(
        private _kind: string,
        public description: string,
        public initialState: { [key: string]: any },
        private collectedSpriteName: string = '',
        public isNothing: boolean = false) {
            this.state = initialState;
    }

    get kind() { return this.state.spriteName || this._kind }

    handleInteraction(): string { 
        if (!this.state.collected) {
            let message = `Collected ${this.kind}`
            this.state = { ...this.state, collected: true, spriteName: this.collectedSpriteName }
            return message;
        } else {
            return ""; //The lonely sands reach."
        }
    };
}

//type TheniaItemName = 'nothing' | 'coin'
//interface NoItem extends Nothing { state: {} }
//export const noItem: () => NoItem = () => { return { kind: 'nothing', isNothing: true, state: {} } }
//export type TheniaItem = NoItem

class Thenia extends World<TheniaItem, TheniaDoodad, TheniaTerrain> {
    dimensions: Point = [2000,2000]
    terrain: Array<Array<number>>;
    doodadMap: Array<Array<number>>;

    itemMap: Array<Array<number>>;

    itemList: Array<{ it: TheniaItem, position: Point }> = []

    constructor() {
        super();
        let [m,n] = this.dimensions;
        // this.things = [];
        this.doodadMap = [];

        this.itemMap = [];
        this.itemList = [];

        this.terrain = [];
        iota(m-1).forEach(y => {
            this.itemMap[y] = Array(n) //.fill(n)
            this.itemMap[y].fill(0,0,n)
            this.doodadMap[y] = Array(n) //.fill(n)
            this.doodadMap[y].fill(0,0,n)
            this.terrain[y] = Array(n)
            this.terrain[y].fill(0,0,n)
        })
    }

    doodadKinds: TheniaDoodad[] = [
        zed(),
        rock(),
        tree(),
        shrub(),
    ];

    terrainKinds: TheniaTerrain[] = [
        zed(),
        grass(),
        water(),
        dirt(),
    ]

    itemKinds: TheniaItem[] = [
        TheniaItem.none(),
        TheniaItem.coin(),
        TheniaItem.coin({ spriteName: 'coinCollected' }),
        TheniaItem.root(),
        TheniaItem.root({ spriteName: 'rootGathered' }),
    ]

    putDoodad(value: number, position: Point): void {
        let [x, y] = position;
        this.doodadMap[y][x] = value
    }

    setTerrain(value: number, position: Point): void {
        let [x, y] = position;
        this.terrain[y][x] = value
    }

    placeItem(it: TheniaItem, position: Point): void {
        let [x, y] = position;
        this.itemList.push({ it, position })
        this.itemMap[y][x] = this.itemKinds.map(e=>e.kind).indexOf(it.kind)
    }

    assembleDoodads(): number[][] {
        // return [];
        return this.doodadMap;
    }

    listDoodads(): TheniaDoodad[] {
        return this.doodadKinds;
    }

    assembleTerrain() {
        return this.terrain;
    }

    listTerrainKinds(): TheniaTerrain[] {
        return this.terrainKinds;
    }

    listItems(): TheniaItem[] {
        return this.itemKinds;
    }

    assembleItems(): Array<Array<number>> {
        return this.itemMap;
    }

    isBlocked(position: [number, number]): boolean {
        let [x,y] = position;
        // let [ix,iy] = [ x * GridView.cellSize, y * GridView.cellSize ];
        let grid = this.doodadMap; //assembleGrid();
        let gx = Math.floor(x/GridView.cellSize);
        let gy = Math.floor(y/GridView.cellSize);

        let blocked = false;
        if (grid[gy]) {
            let value = grid[gy][gx];
            blocked = value > 0
        }
        return blocked;
    }

    scan(origin: [number, number], radius: number): [TheniaItem,Point] | null {
        let matching: [TheniaItem,Point] | null = null;
        let [ox,oy] = origin;
        let sz = GridView.cellSize;
        this.itemList.forEach((item: { it: TheniaItem, position: Point }) => { 
            let [ix,iy] = [item.position[0]*sz,item.position[1]*sz];
            if (distance([ox-sz/2,oy-sz/2], [ix,iy]) < radius) {
                matching = [item.it, item.position]
            }
        })
        return matching;
    }

    interact(it: TheniaItem, pos: Point): string {
        // console.log("WOULD INTERACT WITH", { it, pos })
        let message = it.handleInteraction();
        let [x,y] = pos;

        // console.log("ITEM MAP BEFORE", this.itemMap[y][x])
        // console.log("kind", it.kind)
        // console.log("itemKinds", this.itemKinds)
        this.itemMap[y][x] = this.itemKinds.map(e=>e.kind).indexOf(it.kind)
        // console.log("ITEM MAP AFTER", this.itemMap[y][x])
        return message;
        //let item = this.itemList.indexOf({ it, position: pos });
        //if (item) {
        //} else {
        //    console.warn("Could not find item", { it })
        //}
    }
}


export default Thenia;