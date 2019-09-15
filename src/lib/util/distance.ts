import Point from "../nomos/Values/Point";

const distance = (a: Point, b: Point) => { 
    let [ax,ay] = a;
    let [bx,by] = b;
    return Math.sqrt( (ax - bx)*(ax - bx) + (ay - by)*(ay - by));
}

export default distance;