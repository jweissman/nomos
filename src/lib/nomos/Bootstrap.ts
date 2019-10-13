import { Loader } from "excalibur";
import Game from "./Game";
import genWorld from "./Helpers/WorldBuilder";
import { Resources } from "./Resources";
import assembleSprites from "./Sprites";
import TheniaEngine from "./Models/Thenia";
import Story from "./Models/Nemea/Story";

class Bootstrap {
    constructor() {
        let style = document.createElement("style")
        style.appendChild(
            document.createTextNode(
                "@import url('https://fonts.googleapis.com/css?family=Catamaran:400,600|PT+Sans&display=swap');"
            )
        );
        style.appendChild(
            document.createTextNode(
                // "@import url('https://fonts.googleapis.com/css?family=Catamaran:600|PT+Sans&display=swap');"
                "@import url('https://fonts.googleapis.com/css?family=Manjari|VT323|Turret+Road:400,700&display=swap');"
            )
        );


        document.head.appendChild(style);
        

        let world = new TheniaEngine();
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

    play(world: TheniaEngine) {
        genWorld(world);
        let story = new Story(world);
        story.play();
    }
}

export default Bootstrap;