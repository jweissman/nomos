import { Scene, Color, Engine } from "excalibur";
import { Wander } from "./Scenes/Wander";
import TheniaEngine from "./Models/Thenia";
import { SpriteDict } from "./Values/SpriteDict";
import Fly from "./Scenes/Fly";
import { Ride } from "./Scenes/Ride";
import { Meditate } from "./Scenes/Meditate";

export class Game extends Engine {
    static fonts = { primary: 'Catamaran', secondary: 'PT Sans' }

    constructor(
        private world: TheniaEngine,
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
        let meditate: Scene = new Meditate(this);
        this.addScene('wander', wander);
        this.addScene('fly', fly);
        this.addScene('ride', ride);
        this.addScene('meditate', meditate);
        this.goToScene('wander');
    }
}

export default Game;