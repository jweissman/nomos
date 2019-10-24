import Point from "../nomos/Values/Point";
import { CombatResult, Creature, Doodad, Enemy, Item, Person, Terrain, Quest, Thing } from "./Values";
import { WorldMap } from "./WorldMap";

abstract class World<
    E extends Enemy,
    C extends Creature,
    I extends Item,
    D extends Doodad,
    T extends Terrain,
    P extends Person,
> {
    abstract get dimensions(): Point;
    abstract get map(): WorldMap<E, C, I, D, T, P>;

    public abstract scan(pos: Point, scanRadius: number): [E | C | I | P, Point] | null;
    public abstract interact(it: I | P | C, pos: Point): string[];
    public abstract attack(enemy: E, type: "light" | "heavy"): CombatResult;

    public abstract getPlayerLocation(): Point;
    public abstract setPlayerLocation(pos: Point): void;

    public abstract givePlayerQuest(q: Quest): void;
    public abstract completeQuest(q: Quest): void;
    abstract get currentPlayerQuest(): Quest;

    public abstract ride(creature: C): void;
    public abstract dismount(): void;

    public abstract updateCreature(creature: C): void;
    public abstract updateEnemy(enemy: E): void;
    public abstract updatePerson(person: P): void;
    public abstract updatePlayer(): void;
}

export type Worldlike = World<Enemy, Creature, Item, Doodad, Terrain, Person>;

export { Thing, Terrain, Doodad, Item, Creature, Enemy, Person, WorldMap, CombatResult };
export default World;
