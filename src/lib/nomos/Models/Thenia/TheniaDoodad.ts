import { Doodad } from "../../../ea/World";
export class TheniaDoodad implements Doodad {
    static none(): TheniaDoodad {
        let nullDoodad = new TheniaDoodad('nothing');
        nullDoodad.isNothing = true;
        return nullDoodad;
    }
    isNothing = false;
    static cactus() { return new TheniaDoodad('cactus'); }
    static bigCactus() { return new TheniaDoodad('bigCactus', 1); }
    static rock() { return new TheniaDoodad('rock'); }
    static shrub() { return new TheniaDoodad('shrub'); }
    static smallPool() { return new TheniaDoodad('smallPool', 2); }
    static bones() { return new TheniaDoodad('bones'); }
    static pillar() { return new TheniaDoodad('pillar', 2, true); }
    static pillarCollapsed() { return new TheniaDoodad('pillarCollapsed', 2, true); }

    constructor(public name: string, public size: number = 1, public halfWidth: boolean = false) {
    }

    get kind() { return this.name; }
}
