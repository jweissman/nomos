import { Loader, Vector } from "excalibur";
import Game from "./Game";
import genWorld from "./Helpers/WorldBuilder";
import { Resources, SpriteSheets } from "./Resources";

class Bootstrap {
    static kickstart() {
        let game = new Game(genWorld(), this.assembleSprites());
        let loader = new Loader()
        for (var loadable in Resources) {
            if (Resources.hasOwnProperty(loadable)) {
                loader.addResource(Resources[loadable]);
            }
        }
        loader.suppressPlayButton = true;
        game.start(loader).then(function () {
            console.log("WELCOME!")
        });
    }

    static assembleSprites() { 
        let mouse = Resources.Mouse.asSprite();
        let horse = SpriteSheets.HorseRiding.getSprite(0);
        let horseRiding = SpriteSheets.HorseRiding.getSprite(1);

        let pebble = SpriteSheets.Doodads.getSprite(0);
        let reed = SpriteSheets.Doodads.getSprite(1);
        let cactus = SpriteSheets.Doodads.getSprite(2);
        cactus.scale = new Vector(2,2)

        let dirt = SpriteSheets.Terrain.getSprite(0);
        let grass = SpriteSheets.Terrain.getSprite(1);
        let water = SpriteSheets.Terrain.getSprite(2);
        let ocean = SpriteSheets.Terrain.getSprite(3);

        let coin = SpriteSheets.Items.getSprite(0);
        let root = SpriteSheets.Items.getSprite(1);
        let coinCollected = SpriteSheets.Items.getSprite(2);
        let rootGathered = SpriteSheets.Items.getSprite(3);

        let sprites = {
            tree: cactus, rock: pebble, shrub: reed,
            dirt, grass, water, ocean,
            coin, root,
            coinCollected, rootGathered,

            mouse,
            horse, horseRiding,
         };
        return sprites;
    }
}

export default Bootstrap;