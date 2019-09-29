import { Loader } from "excalibur";
import Game from "./Game";
import genWorld from "./Helpers/WorldBuilder";
import { Resources } from "./Resources";
import assembleSprites from "./Sprites";
import Thenia from "./Models/Thenia";
import Story from "./Models/Thenia/Story";

class Bootstrap {
    constructor() {
        let style = document.createElement("style")
        style.appendChild(
            document.createTextNode(
                // "@import url('htt18ps://fonts.googleapis.com/css?family=Quicksand&display=swap');"
                // "@import url('https://fonts.googleapis.com/css?family=News+Cycle:700|Quicksand&display=swap');"
                "@import url('https://fonts.googleapis.com/css?family=Catamaran:600|Eczar|Philosopher:700&display=swap');"
            )
        );
        document.head.appendChild(style);
        

        let world = new Thenia();
        let game = new Game(world, assembleSprites);
        let loader = new Loader()
        for (var loadable in Resources) {
            if (Resources.hasOwnProperty(loadable)) {
                loader.addResource(Resources[loadable]);
            }
        }
        loader.suppressPlayButton = true;
        game.start(loader).then(() => this.play(world))
    }

    play(world: Thenia) {
        genWorld(world);
        Story.play(world);
    }
}

export default Bootstrap;