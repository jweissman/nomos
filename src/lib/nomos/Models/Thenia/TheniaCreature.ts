import { Creature } from "../../../ea/World";
export class TheniaCreature implements Creature {
    state: {
        [key: string]: any;
    } = { visible: true };
    isNothing = false;
    tame: boolean = false;
    taming: boolean = false;

    constructor(
        public name: string,
        public description: string,
        public species: string,
        public rotateSprite: boolean = true,
        public hops: boolean = false
    ) { }
    get kind() { return this.name; }

    static none(): TheniaCreature {
        let nullCritter = new TheniaCreature('nothing', 'not a creature', 'abyssus');
        nullCritter.isNothing = true;
        return nullCritter;
    }
    static mouse = () => new TheniaCreature('mouse', 'a tiny creature', 'mousus desertus');
    static scorpion = () => new TheniaCreature('scorpion', 'a bit sharp', 'stingus abunchus');
    static lizard = () => new TheniaCreature('lizard', 'little guy', 'slinkus aroundus');
    static snake = () => new TheniaCreature('snake', 'nice viper', 'smoothus curvus');
    static horse = () => new TheniaCreature('horse', 'a majestic beast', 'hippus capabillus');
    static sheep = () => new TheniaCreature('sheep', 'sweet sheep unit', 'cuteus absolutus', false, true);

}
