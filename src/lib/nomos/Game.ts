import { Scene, Color, Engine } from "excalibur";
import { Wander } from "./Scenes/Wander";
import Thenia from "./Models/Thenia";
import { SpriteDict } from "./Values/SpriteDict";
import Fly from "./Scenes/Fly";
import { Ride } from "./Scenes/Ride";

export class Game extends Engine {
    static fonts = { primary: 'Catamaran', secondary: 'PT Sans' }
    // static secondaryFont = 'Eczar'

    constructor(
        private world: Thenia,
        private sprites: (engine: Engine) => SpriteDict
    ) {
        super();
        this.backgroundColor = Color.fromRGB(220,180,160);
    }

    onInitialize() {
        let drawings: SpriteDict = this.sprites(this);
        let wander: Scene = new Wander(this, this.world, drawings);
        let fly: Scene = new Fly(this, this.world, drawings);
        let ride: Scene = new Ride(this, this.world, drawings);
        this.addScene('wander', wander);
        this.addScene('fly', fly);
        this.addScene('ride', ride);
        this.goToScene('wander');
        console.debug("Welcome to Nomos!")
    }
}

export default Game;