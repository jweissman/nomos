import { Loader } from "excalibur";
import Game from "./Game";
import genWorld from "./Helpers/WorldBuilder";
import { Resources } from "./Resources";
import assembleSprites from "./Sprites";

class Bootstrap {
    constructor() {
        let game = new Game(genWorld(), assembleSprites);
        let loader = new Loader()
        for (var loadable in Resources) {
            if (Resources.hasOwnProperty(loadable)) {
                loader.addResource(Resources[loadable]);
            }
        }
        loader.suppressPlayButton = true;
        game.start(loader).then(function () {
            console.debug("WELCOME!")
        });
    }
}

export default Bootstrap;