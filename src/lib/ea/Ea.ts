import World, { Enemy, Creature, Item, Doodad, Terrain, Quest, Wonder } from "./World";
import { Cartogram, EntityKinds } from "./Cartogram";
import Point from "../nomos/Values/Point";
import Player from "./Player";

// ea provides a base implementation of world engine
// so thenia doesn't have to consider so much
// methods with 'brief implementations' at the pure ea
// level can live here anyway: implementing the cartogram etc
abstract class Ea<
    E extends Enemy,
    C extends Creature,
    I extends Item,
    D extends Doodad,
    T extends Terrain,
> extends World<E, C, I, D, T> {
    public map: Cartogram<E,C, I, D, T>;
    protected log: string[] = [];
    protected player: Player = new Player();
    protected createdAt: number = -1;

    constructor(public dimensions: Point, public kinds: EntityKinds<E, C, I, D, T>) {
        super();
        this.map = this.buildMap(); 
        this.createdAt = new Date().getTime();
    }

    setPlayerLocation(pos: Point) {
        this.player.location = pos
    }

    getPlayerLocation() {
        return this.player.location
    }

    givePlayerQuest(q: Quest): void {
        this.player.quests.push(q);
    }

    get currentPlayerQuest(): Quest {
        return this.player.quests[0];
    }

    completeQuest(q: { kind: "seek"; goal: Wonder | Item; }): void {
        let i = this.player.quests.indexOf(q);
        delete this.player.quests[i];
    }

    updatePlayer(): void {}
    updateCreature(creature: C): void {}
    updateEnemy(enemy: E): void {}

    interact(it: I, pos: Point): string {
        let message = it.interact();
        this.map.updateItemAt(pos, it)
        return message;
    }

    private buildMap(): Cartogram<E, C, I, D, T> {
        return new Cartogram<E, C, I, D, T>(this.dimensions, this.kinds);
    }
}

export default Ea;