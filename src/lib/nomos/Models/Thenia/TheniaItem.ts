import { Item } from "../World"
export class TheniaItem implements Item {
    state: {
        [key: string]: any;
    } = {};

    static none = () => new TheniaItem('nothing', 'not a thing', {}, '', true);
    static coin = (state: { [key: string]: any; } = {}) =>
        new TheniaItem('coin', 'It glitters in the glare', state, 'coinCollected');
    static root = (state: { [key: string]: any; } = {}) =>
        new TheniaItem('root', 'A gnarled survivor', state, 'rootGathered');

    constructor(
        public name: string,
        public description: string,
        public initialState: { [key: string]: any; },
        private collectedSpriteName: string = '',
        public isNothing: boolean = false
    ) {
        this.state = initialState;
    }

    get kind() { return this.state.spriteName || this.name; }

    handleInteraction(): string {
        if (!this.state.collected) {
            let message = `Collected ${this.kind}`;
            this.state = { ...this.state, collected: true, spriteName: this.collectedSpriteName };
            return message;
        }
        else {
            return ""; //The lonely sands reach."
        }
    };
}
