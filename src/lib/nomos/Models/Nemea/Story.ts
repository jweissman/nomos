import { Worldlike, Wonder, seekWonder, Quest } from "../../../ea/World";
import Point from "../../Values/Point";
import { TheniaDoodad } from "../Thenia/TheniaDoodad";
import { TheniaItem } from "../Thenia/TheniaItem";
import distance from "../../../util/distance";
import { dereference } from "../../../ea/MapLayer";
import getRandomInt from "../../../util/getRandomInt";


export default class Story {
    oasisDistance: number = 100
    constructor(private world: Worldlike) {
    }

    private get width() { return this.world.dimensions[0] }
    private get height() { return this.world.dimensions[1] }

    private get atastLocation() {
        let atastCenter: Point = [this.width / 2 + 1, this.height / 2 - 90]
        return dereference(atastCenter, this.world.dimensions)
    }

    get qutbLocation(): Point { return dereference([this.atastLocation[0], this.atastLocation[1] - this.oasisDistance], this.world.dimensions) }

    play() {
        this.createAtast()
        this.createQutb()
        let seekOasis = this.createOasisQuest();
        this.world.givePlayerQuest(seekOasis);
    }

    createAtast() {
        let pillar: TheniaDoodad = TheniaDoodad.pillar()
        let pillarCollapsed: TheniaDoodad = TheniaDoodad.pillarCollapsed()
        let [ax,ay] = this.atastLocation
        let walls = [ pillarCollapsed, pillar ]

        this.createBuilding(walls, [ax + 10, ay], [ 10, 6 ], 2)

        for (let i = 0; i <3; i++) {
            this.createBuilding(walls, [ax - 10  - (48 * i), ay - 28], [8, 10], 2)
        }
    }

    createBuilding(wallObjects: TheniaDoodad[], location: Point, dims: Point, scale: number = 3, placementChance: number = 0.5): void {
        let [w,h] = dims
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                if (x == 0 || y == 0 || x === w-1 || y === h-1) {
                    if (Math.random() < placementChance) {
                        let wallObject: TheniaDoodad = wallObjects[
                            getRandomInt(0, wallObjects.length)
                        ];
                        this.world.map.putDoodad(wallObject, [location[0] + x * scale, location[1] + y * scale])
                    }
                }
            }
        }
    }


    createQutb(): void {
        let [x,y] = this.qutbLocation;
        let lake: TheniaDoodad = TheniaDoodad.smallPool();
        let scale = 3 
        let extent = 50
        for (let dx = -extent; dx < extent; dx++) {
            for (let dy = -extent; dy < extent; dy++) {
                let s = scale-1
                let ex = x + (scale * dx) + getRandomInt(-s, s)
                let ey = y + (scale * dy) + getRandomInt(-s, s)
                let dist = distance([ex,ey],[x,y]) 
                let r = extent * scale
                if (dist < r) {
                    if (Math.random() < 0.3 - (dist / r)) {
                        this.world.map.putDoodad(lake, [ex, ey])
                    }
                }
            }
        }
    }

    createOasisQuest(): Quest {
        let oasisLocation: Point = this.qutbLocation;
        let clueOneLocation: Point = [this.width / 2 - 15, this.height / 2 + 4]
        let clueTwoLocation: Point = this.atastLocation
        let oasisQuest: Wonder = new Wonder('Qutb Oasis', 'the Oasis');
        oasisQuest.clueLocations = [clueOneLocation, clueTwoLocation];
        oasisQuest.location = [oasisLocation[0] + 4, oasisLocation[1] + 6];
        let oasisClueOne: TheniaItem = TheniaItem.note(
            `"...The Qutb Oasis, fed by the Kul springs,
is a jewel of the endless Nem'ean sands located to the north--"
There must be more to the message.`
        )
        let oasisClueTwo: TheniaItem = TheniaItem.note('"--of the ancient ruins of Atast..." Okay!')
        this.world.map.placeItem(oasisClueOne, clueOneLocation);
        this.world.map.placeItem(oasisClueTwo, clueTwoLocation);
        let seekOasis = seekWonder(oasisQuest)
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