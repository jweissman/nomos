import { Loader } from "excalibur";
import Game, { Resources, SpriteSheets } from "./Game";
import genWorld from "./Helpers/WorldBuilder";

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
        let pebble = SpriteSheets.Doodads.getSprite(0);
        let reed = SpriteSheets.Doodads.getSprite(1);
        let cactus = SpriteSheets.Doodads.getSprite(2);

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
         };
        return sprites;
    }
}

export default Bootstrap;