import { Worldlike, Wonder, seekWonder } from "../World";
import Point from "../../Values/Point";
import { TheniaDoodad } from "./TheniaDoodad";
import { TheniaItem } from "./TheniaItem";

export default class Story {
    static play(world: Worldlike) {
        let [width, height] = world.dimensions
        let oasisLocation: Point = [ width/2 + 10, height/2-30 ]
        let clueOneLocation: Point = [ width/2 - 5, height/2+4 ]
        let clueTwoLocation: Point = [ width/2 - 1, height/2+7 ]
        let lake: TheniaDoodad = TheniaDoodad.oasis();
        //
        let [ox,oy] = oasisLocation;
        let r = 10
        this.clearArea(world, [
            [ox-r,oy-r],
            [ox+r,oy+r]
        ])
        world.map.putDoodad(lake, oasisLocation)
        world.map.putDoodad(lake, [oasisLocation[0]-7, oasisLocation[1]])
        world.map.putDoodad(lake, [oasisLocation[0]+2, oasisLocation[1]-6])
        world.map.putDoodad(lake, [oasisLocation[0], oasisLocation[1]-12])
        world.map.putDoodad(lake, [oasisLocation[0]-7, oasisLocation[1]-12])
        let oasisQuest: Wonder = new Wonder('Qutb Oasis', 'the Oasis');
        oasisQuest.clueLocations = [clueOneLocation, clueTwoLocation];
        oasisQuest.location = [oasisLocation[0]+4,oasisLocation[1]+6];
        let oasisClueOne: TheniaItem = TheniaItem.note(
`"The Qutb Oasis, fed by the Kul springs,
is a jewel of the endless Nemian sands--"
There must be more to the message.`
        )
        let oasisClueTwo: TheniaItem = TheniaItem.note('"The Oasis is located to the north of the ruins of Atast." Okay!')
        world.map.placeItem(oasisClueOne, clueOneLocation);
        world.map.placeItem(oasisClueTwo, clueTwoLocation);
        let seekOasis = seekWonder(oasisQuest)
        world.givePlayerQuest(seekOasis);
        return
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