import { Person } from "../../../ea/World";
import Dialogue, { conversation } from "../../../ea/Dialogue";

export class TheniaPerson implements Person {
    state: {} = {};
    species: string = 'homo sap';
    isNothing: boolean = false;

    public constructor(
        public name: string,
        public description: string,
        private spriteName: string,
        private dialogue: Dialogue
    ) { };

    get kind() { return this.spriteName; }

    get says() {
        return this.dialogue;
    }

    static none() {
        let nullPerson = new TheniaPerson('Nohbdy', 'no one', '', conversation('no one', []))
        nullPerson.isNothing = true
        return nullPerson
    }

    static wiseMan(dialogue: Dialogue) {
        return new TheniaPerson('Wise Man', 'a thoughtful person', 'wise-man', dialogue)
    }
}
