import { Person } from "../../../ea/World";
import Dialogue, { conversation, topic, q } from "../../../ea/Dialogue";

export class TheniaPerson implements Person {
    state: {} = {};
    species: string = 'homo sap';
    isNothing: boolean = false;
    public constructor(public name: string, public description: string, private spriteName: string) {};

    get kind() { return this.spriteName; }

    get says() {
        let dialogue: Dialogue = conversation(
            this.name,
            [
                topic('nemea', [
                    q('what is this place?', ['a very old ruin'])
                ])
            ]
        )
        return dialogue;
    }

    static none() {
        let nullPerson = new TheniaPerson('Nohbdy', 'no one', '')
        nullPerson.isNothing = true
        return nullPerson
    }

    static wiseMan() {
        // console.log("create wise man")
        return new TheniaPerson('Wise Man', 'a thoughtful person', 'wise-man')
    }
}
