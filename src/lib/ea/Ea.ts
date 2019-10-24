import Point from "../nomos/Values/Point";
import { Cartogram, EntityKinds } from "./Cartogram";
import Player from "./Player";
import { Quest } from "./Values";
import { Wonder } from "./Wonder";
import World, { Creature, Doodad, Enemy, Item, Person, Terrain } from "./World";

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
    P extends Person,
> extends World<E, C, I, D, T, P> {
    public map: Cartogram<E, C, I, D, T, P>;
    public lastScene: string = "";
    protected log: string[] = [];
    protected player: Player = new Player();
    protected createdAt: number = -1;

    constructor(public dimensions: Point, public kinds: EntityKinds<E, C, I, D, T, P>) {
        super();
        this.map = this.buildMap();
        this.createdAt = new Date().getTime();
    }

    public setPlayerLocation(pos: Point) {
        this.player.location = pos;
    }

    public getPlayerLocation() {
        return this.player.location;
    }

    public givePlayerQuest(q: Quest): void {
        this.player.quests.push(q);
    }

    get currentPlayerQuest(): Quest {
        return this.player.quests[0];
    }

    public completeQuest(q: { kind: "seek"; goal: Wonder | Item; }): void {
        const i = this.player.quests.indexOf(q);
        delete this.player.quests[i];
    }

    public updatePlayer(): void {}
    public updateCreature(creature: C): void {}
    public updateEnemy(enemy: E): void {}
    public updatePerson(person: P): void {}

    public interact(it: I, pos: Point): string[] {
        const message = it.interact();
        this.map.updateItemAt(pos, it);
        return message;
    }

    public setLastScene(name: string) {
        this.lastScene = name;
    }

    private buildMap(): Cartogram<E, C, I, D, T, P> {
        return new Cartogram<E, C, I, D, T, P>(
            this.dimensions,
            this.kinds,
        );
    }
}

export default Ea;
