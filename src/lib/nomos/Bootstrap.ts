import { Loader } from "excalibur";
import Game from "./Game";
import genWorld from "./Helpers/WorldBuilder";
import { Resources } from "./Resources";
import assembleSprites from "./Sprites";
import { seekWonder, Wonder } from "./Models/World";
import { TheniaItem } from "./Models/Thenia/TheniaItem";
import { TheniaDoodad } from "./Models/Thenia/TheniaDoodad";
import Point from "./Values/Point";
import Thenia from "./Models/Thenia";

class Bootstrap {
    constructor() {
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
        let [width, height] = world.dimensions
        let oasisLocation: Point = [ width/2 + 10, height/2-1380 ]
        let clueOneLocation: Point = [ width/2 - 20, height/2+10 ]
        let clueTwoLocation: Point = [ width/2 - 10, height/2+70 ]
        let oasis: TheniaDoodad = TheniaDoodad.oasis();
        world.map.putDoodad(oasis, oasisLocation)
        let oasisQuest: Wonder = new Wonder('Qutb Oasis', 'the Oasis');
        oasisQuest.clueLocations = [clueOneLocation, clueTwoLocation];
        oasisQuest.location = [oasisLocation[0]+4,oasisLocation[1]+6];
        let oasisClueOne: TheniaItem = TheniaItem.note('I have found the oasis, but I cannot tell you here. Seek my other note')
        let oasisClueTwo: TheniaItem = TheniaItem.note('Okay, I can finally tell you. The oasis is to the north')
        world.map.placeItem(oasisClueOne, clueOneLocation);
        world.map.placeItem(oasisClueTwo, clueTwoLocation);
        let seekOasis = seekWonder(oasisQuest)
        world.givePlayerQuest(seekOasis);
        return
    }
}

export default Bootstrap;