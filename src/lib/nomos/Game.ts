import { Texture, Scene, SpriteSheet, Color, Engine } from "excalibur";
import { Wander } from "./Scenes/Wander";
import Thenia from "./Models/Thenia";
import { SpriteDict } from "./Values/SpriteDict";

export const Resources: { [key: string]: Texture } = {
    Tree: new Texture("/assets/tree.png"),
    Rock: new Texture("/assets/stone.png"),
    Territory: new Texture("/assets/territory.png"),
    Wanderer: new Texture("/assets/wanderer.png"),
    Items: new Texture("/assets/items.png"),
    Doodads: new Texture("/assets/doodads.png"),
}

export const SpriteSheets: { [key: string]: SpriteSheet } = {
    Terrain: new SpriteSheet(Resources.Territory, 2, 4, 64, 64),
    Items: new SpriteSheet(Resources.Items, 2, 2, 64, 64),
    Doodads: new SpriteSheet(Resources.Doodads, 2, 2, 64, 64),
}

export class Game extends Engine {
    constructor(
        world: Thenia,
        sprites: SpriteDict
    ) {
        super();
        this.backgroundColor = Color.fromRGB(220,180,160);
        let welcome: Scene = new Wander(this, world, sprites);
        this.addScene('welcome', welcome);
        this.goToScene('welcome');
    }

}

export default Game;