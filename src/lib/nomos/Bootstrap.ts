import { Loader } from "excalibur";
import Game from "./Game";
import genWorld from "./Helpers/WorldBuilder";
import { Resources } from "./Resources";
import assembleSprites from "./Sprites";
import TheniaEngine from "./Models/Thenia";
import Story from "./Models/Nemea/Story";
import { speciesList } from "./Typography";

class Bootstrap {
    constructor() {
        // 0. load fonts
        let style = document.createElement("style")
        let importFontFamilies = 
                `@import url('https://fonts.googleapis.com/css?family=${speciesList.join("|")}:400,600,700|PT+Sans&display=swap');`
        style.appendChild(
            document.createTextNode(importFontFamilies)
        );
        document.head.appendChild(style);

        // 1. run boot
        let world = new TheniaEngine();
        let game = new Game(world, assembleSprites);
        let loader = new Loader()
        for (var loadable in Resources) {
            if (Resources.hasOwnProperty(loadable)) {
                loader.addResource(Resources[loadable]);
            }
        }
        loader.backgroundColor = 'rgba(180,160,160)'
        loader.logo = ''
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