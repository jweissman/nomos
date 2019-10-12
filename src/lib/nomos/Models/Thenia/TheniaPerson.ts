import { Person } from "../../../ea/World";
export class TheniaPerson implements Person {
    state: {} = {};
    species: string = 'homo sap';
    isNothing: boolean = false;
    public constructor(public name: string, public description: string, private spriteName: string) {};

    get kind() { return this.spriteName; }

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
