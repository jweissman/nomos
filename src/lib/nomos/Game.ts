import { Scene, Color, Engine } from "excalibur";
import { Wander } from "./Scenes/Wander";
import Thenia from "./Models/Thenia";
import { SpriteDict } from "./Values/SpriteDict";
import Fly from "./Scenes/Fly";
import { Ride } from "./Scenes/Ride";

export class Game extends Engine {
    constructor(
        world: Thenia,
        sprites: (engine: Engine) => SpriteDict
    ) {
        super();
        this.backgroundColor = Color.fromRGB(220,180,160);
        let drawings: SpriteDict = sprites(this);
        let wander: Scene = new Wander(this, world, drawings);
        let fly: Scene = new Fly(this, world, drawings);
        let ride: Scene = new Ride(this, world, drawings);
        this.addScene('wander', wander);
        this.addScene('fly', fly);
        this.addScene('ride', ride);
        this.goToScene('wander');
    }

    onInitialize() {

    }

}

export default Game;