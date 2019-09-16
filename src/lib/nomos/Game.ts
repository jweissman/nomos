import { Scene, Color, Engine } from "excalibur";
import { Wander } from "./Scenes/Wander";
import Thenia from "./Models/Thenia";
import { SpriteDict } from "./Values/SpriteDict";
import Fly from "./Scenes/Fly";
import { Ride } from "./Scenes/Ride";

export class Game extends Engine {
    constructor(
        world: Thenia,
        sprites: SpriteDict
    ) {
        super();
        this.backgroundColor = Color.fromRGB(220,180,160);
        let wander: Scene = new Wander(this, world, sprites);
        let fly: Scene = new Fly(this, world, sprites);
        let ride: Scene = new Ride(this, world, sprites);
        this.addScene('wander', wander);
        this.addScene('fly', fly);
        this.addScene('ride', ride);
        this.goToScene('wander');
    }

}

export default Game;