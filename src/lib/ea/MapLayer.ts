import Point from "../nomos/Values/Point";
import mod from "../util/mod";

export function dereference(point: Point, dims: Point): Point {
    let [x, y] = point;
    let [w, h] = dims;
    return [mod(x, w), mod(y, h)];
}

export class MapLayer<T extends { kind: string }> {
    public map: Array<Array<number>> = [];
    public list: T[] = [];
    private positions: Point[] = [];
    constructor(name: string, private dimensions: Point, public kinds: T[], private mapped: boolean = true) {
        this.map = [];
        this.zeroOut();
    }

    deref(point: Point): Point { return dereference(point, this.dimensions); }


    spawn(it: T, position: Point) {
        let [x, y] = this.deref(position);
        this.list.push(it);
        this.positions.push(position);
        if (this.mapped) {
            this.map[y] = this.map[y] || [];
            this.map[y][x] = this.kinds.map(e => e.kind).indexOf(it.kind)
        }
    }

    remove(position: Point) {
        let [x, y] = this.deref(position);
        if (this.map[y]) {
            this.map[y][x] = 0;
            let i = this.positions.indexOf(position);
            if (this.list[i]) {
                delete this.list[i]
                delete this.positions[i]
            }
        }
    }

    assemble(): Array<Array<number>> { 
        if (!this.mapped) {
            throw new Error("Cannot assemble an unmapped layer")
        }
        return this.map;
    }

    getKindAt(pos: Point): T | null {
        if (this.mapped) {
            let [x,y] = this.deref(pos);
            if (this.map[y] && this.map[y][x]) {
                return this.kinds[this.map[y][x]];
            }
        }
        return null
    }

    getPos(t: T) { return this.positions[this.list.indexOf(t)]; }

    setPos(it: T, p: Point) {
        let [x,y] = this.deref(p)
        this.positions[this.list.indexOf(it)] = p;
        if (this.mapped) {
            this.map[y] = this.map[y] || []
            this.map[y][x] = this.kinds.map(e => e.kind).indexOf(it.kind)
        }
    }
    updateAt(pos: Point, it: T) {
        let [x,y] = this.deref(pos)
        let i = this.positions.indexOf(pos)
        this.list[i] = it;
        if (this.mapped) {
            this.map[y] = this.map[y] || []
            this.map[y][x] = this.kinds.map(e => e.kind).indexOf(it.kind)
        }
    }
    zeroOut() {
        if (this.mapped) {
            let [m, n] = this.dimensions;
            for (let y = 0; y < m; y++) {
                this.map[y] = Array(n);
                this.map[y].fill(0, 0, n);
            }
        }
    }
    find(start: Point, end: Point): { it: T, position: Point }[] {
        let [sx,sy] = start;
        let [ex,ey] = end;
        let found: { it: T, position: Point }[] = []
        for (let i = 0; i < this.list.length; i++) {
            let [x, y] = this.positions[i];
            let within = x >= sx && x <= ex && y >= sy && y <= ey;
            if (within) {
                let it = this.list[i];
                found.push({ it, position: [x, y] });
            }
        }
        return found
    }
}

