import { Terrain } from "../../../ea/World";
export class TheniaTerrain implements Terrain {
    isNothing = false;
    static none(): TheniaTerrain {
        let nullTerrain = new TheniaTerrain('nothing here', 'not a thing');
        nullTerrain.isNothing = true;
        return nullTerrain;
    }
    static grass = () => new TheniaTerrain('grass', 'some scraggly crabcrass');
    static flowers = () => new TheniaTerrain('flowers', 'some tiny flowers');
    static scrub = () => new TheniaTerrain('scrub', 'a little brush');
    static stone = () => new TheniaTerrain('stone', 'a tiny bit of rock');
    constructor(public name: string, public description: string) { }
    get kind() { return this.name; }
}
