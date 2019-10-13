import { Item } from "../../../ea/World"
export class TheniaItem implements Item {
    public state: {
        [key: string]: any;
    } = {};

    static none = () => new TheniaItem('nothing', 'not a thing', {}, 'uncollectable', ['nothing to say about it'], true);
    static coin = (state: { [key: string]: any; } = {}) =>
        new TheniaItem('coin', 'It glitters in the glare', state, 'coinCollected');
    static root = (state: { [key: string]: any; } = {}) =>
        new TheniaItem('root', 'A gnarled survivor', state, 'rootGathered');
    static note = (message: string[], state: { [key: string]: any; } = {}) =>
        new TheniaItem('letter', 'A little note', state, 'letterRead', message);
        
    constructor(
        public name: string,
        public description: string,
        public initialState: { [key: string]: any; },
        private collectedSpriteName: string = '',
        private message: string[] = [""],
        public isNothing: boolean = false
    ) {
        this.state = initialState;
    }

    get kind() { return this.state.spriteName || this.name; }

    interact(): string[] {
        if (!this.state.collected) {
            let message = this.message; //[0] || [`Collected ${this.kind}`];
            this.state = { ...this.state, collected: true, spriteName: this.collectedSpriteName };
            return message;
        }
        else {
            return [""];
        }
    };
}
