import { Doodad } from "../World";
export class TheniaDoodad implements Doodad {
    static none(): TheniaDoodad {
        let nullDoodad = new TheniaDoodad('nothing');
        nullDoodad.isNothing = true;
        return nullDoodad;
    }
    isNothing = false;
    static cactus() { return new TheniaDoodad('cactus'); }
    static bigCactus() { return new TheniaDoodad('bigCactus', 2); }
    static rock() { return new TheniaDoodad('rock'); }
    static shrub() { return new TheniaDoodad('shrub'); }
    constructor(private name: string, public size: number = 1) { }
    get kind() { return this.name; }
}
