import { Creature } from "../../../ea/World";
import { Vector } from "excalibur";
export class TheniaCreature implements Creature {
    state: {
        activity: 'idle' | 'moving' | 'taming'
        visible: boolean
        facing: Vector | null
        // [key: string]: any;
    } = {
        visible: true,
        activity: 'idle',
        facing: null,
    };
    isNothing = false;
    isTame: boolean = false;
    startedTamingAt: number = -1;
    // taming: boolean = false;

    constructor(
        public name: string,
        public description: string,
        public species: string,
        public rotateSprite: boolean = true,
        public hops: boolean = false
    ) { }

    get kind() { return this.spriteName; }
    get spriteName() {
        if (this.state.activity === 'taming') {
            return `${this.name}-hearts`
        }
        return this.name;
    }

    tame() {
        this.startedTamingAt = new Date().getTime();
        this.state.activity = 'taming';
    }

    static none(): TheniaCreature {
        let nullCritter = new TheniaCreature('nothing', 'not a creature', 'abyssus');
        nullCritter.isNothing = true;
        return nullCritter;
    }

    static mouse    = () => new TheniaCreature('mouse', 'a tiny creature', 'mousus desertus');
    static scorpion = () => new TheniaCreature('scorpion', 'a bit sharp', 'stingus abunchus');
    static lizard   = () => new TheniaCreature('lizard', 'little guy', 'slinkus aroundus');
    static snake    = () => new TheniaCreature('snake', 'nice viper', 'smoothus curvus');
    static horse    = () => new TheniaCreature('horse', 'a majestic beast', 'hippus capabillus');
    static sheep    = () => new TheniaCreature('sheep', 'sweet sheep unit', 'cuteus absolutus', false, true);
}
