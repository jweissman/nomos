import { Loader, Vector, Engine } from "excalibur";
import Game from "./Game";
import genWorld from "./Helpers/WorldBuilder";
import { Resources, SpriteSheets } from "./Resources";
import { SpriteDict } from "./Values/SpriteDict";

class Bootstrap {
    constructor() {
        let game = new Game(genWorld(), (engine) => Bootstrap.assembleSprites(engine));
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

    static assembleSprites(engine: Engine): SpriteDict { 
        let mouse = SpriteSheets.Animals.getAnimationBetween(engine, 0, 4, 250);
        let scorpion = SpriteSheets.Animals.getAnimationBetween(engine, 4, 8, 160);
        let lizard = SpriteSheets.Animals.getAnimationBetween(engine, 8, 12, 80);
        let snake = SpriteSheets.Animals.getAnimationBetween(engine, 12, 16, 120);

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

        let sprites: SpriteDict = {
            tree: cactus, rock: pebble, shrub: reed,
            dirt, grass, water, ocean,
            coin, root,
            coinCollected, rootGathered,
            mouse, scorpion, lizard, snake,
            horse, horseRiding,
         };
        return sprites;
    }
}

export default Bootstrap;