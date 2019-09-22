import Point from "../Values/Point";

export class MapLayer<T extends { kind: string }> {
    public map: Array<Array<number>> = [];
    public list: T[] = [];
    private positions: Point[] = [];
    // mapped indicates whether we'll fill in the map...
    constructor(name: string, private dimensions: Point, public kinds: T[], private mapped: boolean = true) {
        this.map = [];
        this.zeroOut();
        console.debug(`---> Create map layer ${name}`)
    }
    spawn(it: T, position: Point) {
        let [x, y] = position;
        this.list.push(it);
        this.positions.push(position);
        if (this.mapped && this.map[y]) {
            this.map[y][x] = this.kinds.map(e => e.kind).indexOf(it.kind)
        }
    }
    assemble(): Array<Array<number>> { 
        if (!this.mapped) {
            throw new Error("Cannot assemble an unmapped layer")
        }
        return this.map;
    }
    getAt(pos: Point) {
        throw new Error("Method not implemented.")
    }
    getKindAt(pos: Point): T | null {
        if (this.mapped) {
            let [x,y] = pos;
            if (this.map[y] && this.map[y][x]) {
                return this.kinds[this.map[y][x]];
            }
        }
        return null
    }
    getPos(t: T) { return this.positions[this.list.indexOf(t)]; }
    setPos(it: T, p: Point) {
        let [x,y] = p
        this.positions[this.list.indexOf(it)] = p;
        if (this.mapped) {
            this.map[y][x] = this.kinds.map(e => e.kind).indexOf(it.kind)
        }
    }
    updateAt(pos: Point, it: T) {
        let [x,y] = pos
        let i = this.positions.indexOf(pos)
        this.list[i] = it;
        if (this.mapped) {
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

