import { Creature } from "../World";
export class TheniaCreature implements Creature {
    static none(): TheniaCreature {
        let nullCritter = new TheniaCreature('nothing', 'not a creature', 'abyssus');
        nullCritter.isNothing = true;
        return nullCritter;
    }
    state: {
        [key: string]: any;
    } = { visible: true };
    isNothing = false;
    static mouse = () => new TheniaCreature('mouse', 'a tiny creature', 'mousus desertus');
    static scorpion = () => new TheniaCreature('scorpion', 'a bit sharp', 'stingus abunchus');
    static lizard = () => new TheniaCreature('lizard', 'little guy', 'slinkus aroundus');
    static snake = () => new TheniaCreature('snake', 'nice viper', 'smoothus curvus');
    static horse = () => new TheniaCreature('horse', 'a majestic beast', 'hippus capabillus');
    constructor(public name: string, public description: string, public species: string) { }
    get kind() { return this.name; }
}
