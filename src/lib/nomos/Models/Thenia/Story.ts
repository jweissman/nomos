import { Worldlike, Wonder, seekWonder, Quest } from "../World";
import Point from "../../Values/Point";
import { TheniaDoodad } from "./TheniaDoodad";
import { TheniaItem } from "./TheniaItem";

export default class Story {
    static play(world: Worldlike) {
        let seekOasis = Story.createOasisQuest(world);
        world.givePlayerQuest(seekOasis);
    }

    static createOasisQuest(world: Worldlike): Quest {
        let [width, height] = world.dimensions
        let oasisLocation: Point = [width / 2 + 10, height / 2 - 100]
        let clueOneLocation: Point = [width / 2 - 15, height / 2 + 4]
        let clueTwoLocation: Point = [width / 2 - 1, height / 2 + 17]
        // let osz = 9
        // let oasisFrame: [Point, Point] = [
        //     [oasisLocation[0]-osz,oasisLocation[1]-osz],
        //     [oasisLocation[0]+osz,oasisLocation[1]+osz]
        // ]
        // Story.clearArea(world, oasisFrame)
        let lake: TheniaDoodad = TheniaDoodad.oasis();
        world.map.putDoodad(lake, oasisLocation)
        world.map.putDoodad(lake, [oasisLocation[0] - 12, oasisLocation[1] + 6])
        world.map.putDoodad(lake, [oasisLocation[0] - 12, oasisLocation[1] - 6])
        world.map.putDoodad(lake, [oasisLocation[0] + 12, oasisLocation[1] - 6])
        // world.map.putDoodad(lake, [oasisLocation[0], oasisLocation[1] - 14])
        world.map.putDoodad(lake, [oasisLocation[0] - 24, oasisLocation[1] + 6])
        let oasisQuest: Wonder = new Wonder('Qutb Oasis', 'the Oasis');
        oasisQuest.clueLocations = [clueOneLocation, clueTwoLocation];
        oasisQuest.location = [oasisLocation[0] + 4, oasisLocation[1] + 6];
        let oasisClueOne: TheniaItem = TheniaItem.note(
            `"The Qutb Oasis, fed by the Kul springs,
is a jewel of the endless Nemian sands--"
There must be more to the message.`
        )
        let oasisClueTwo: TheniaItem = TheniaItem.note('"The Oasis is located to the north of the ruins of Atast." Okay!')
        world.map.placeItem(oasisClueOne, clueOneLocation);
        world.map.placeItem(oasisClueTwo, clueTwoLocation);
        let seekOasis = seekWonder(oasisQuest)
        // world.givePlayerQuest(seekOasis);
        return seekOasis
    }

    static clearArea(world: Worldlike, frame: [Point, Point]) {
        let [x,y] = frame[0]
        let [ex,ey] = frame[1];
        for (let dx = x; dx < ex; dx++) {
            for (let dy = y; dy < ey; dy++) {
                world.map.removeDoodad([dx,dy])
            }
        }
    }
}