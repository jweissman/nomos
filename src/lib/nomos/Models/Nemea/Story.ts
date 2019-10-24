import { conversation, q, topic } from "../../../ea/Dialogue";
import { dereference } from "../../../ea/MapLayer";
import { Quest } from "../../../ea/Values";
import { seekWonder, Wonder } from "../../../ea/Wonder";
import { Worldlike } from "../../../ea/World";
import distance from "../../../util/distance";
import getRandomInt from "../../../util/getRandomInt";
import Point from "../../Values/Point";
import { TheniaDoodad } from "../Thenia/TheniaDoodad";
import { TheniaItem } from "../Thenia/TheniaItem";
import { TheniaPerson } from "../Thenia/TheniaPerson";

export default class Story {

    private get width() { return this.world.dimensions[0]; }
    private get height() { return this.world.dimensions[1]; }

    private get atastLocation() {
        const atastCenter: Point = [this.width / 2 + 1, this.height / 2 - 90];
        return dereference(atastCenter, this.world.dimensions);
    }

    get qutbLocation(): Point {
        return dereference(
            [this.atastLocation[0], this.atastLocation[1] - this.oasisDistance],
            this.world.dimensions,
        );
    }

    public static clearArea(world: Worldlike, frame: [Point, Point]) {
        const [x, y] = frame[0];
        const [ex, ey] = frame[1];
        for (let dx = x; dx < ex; dx++) {
            for (let dy = y; dy < ey; dy++) {
                world.map.removeDoodad([dx, dy]);
            }
        }
    }
    public oasisDistance: number = 100;
    constructor(private world: Worldlike) {
    }

    public play() {
        this.createAtast();
        this.createQutb();
        const seekOasis = this.createOasisQuest();
        this.world.givePlayerQuest(seekOasis);

        const middle: Point = [ this.width / 2, this.height / 2 ];
        this.world.map.spawnPerson(
            TheniaPerson.wiseMan(
                conversation(
                    "Old Man",
                    [
                        topic("Nemea", [
                            q("Ruins",
                                ["Old Atast was an ancient capital of the Empire,", "its secrets now lost to the sand..."],
                                ["Would you like to hear the story?", "It will not take too long..."],
                            ),
                            q("Founding",
                                ["A long time ago, in the ancient desert,", "two great kingdoms, pious Umas and cruel Nel,", "fought a great war for control of these lands."],
                                ["Well, after years of conflict,", "Alcasim of Nel, called Polymetes,", "defeated Aaqib of Umas in battle."],
                                ["Now Polymetes designed to build",  "a great hold that would guard Nemea forever,", "so he founded a city deep in the desert..."],
                                ["And he drew water to his city even from Niv'eh,", "which is what the nomads call the great spring,", "so that his city might drink and grow and flourish."],
                                ["Now the foundations of the city were to be", "laid deep, so that high towers might be raised,", "with thick walls to guard them."],
                                ["Polymetes named his city Atast, \"the curious\",", "for in its courtyards and towers learned scholars", "were to dialogue and dream and design."],
                                ["The archives of Atast overflowed with the scrolls", "of the wise; and its walls were hemmed in", "by great pastures. And beyond the desert waited."],
                            ),
                            q("Fall",
                              ["Beset on all sides by colonies in revolt, and then", "scoured by a catastrophe they call the Last Flood", "the Nelian empire receded."],
                              ["The Nelian king and capital fled back to their", "homeland. And for a brief time Atast knew solace."],
                              ["But without an imperial budget,", "the old walls crumbled,", "and the ancient hold fell."],
                              ["So the towers could no longer stand,", "but yet the old city survived for a time.", "Some of the nomad tribes remember it well."],
                              ["The city finally died by the drying up of Niv'eh,", "the spring from which it drew its water.", "Pastures fallow, the population dwindled."],
                              ["Now these ruins are all that remains", "of the free city of Atast."],
                            ),
                        ]),
                        topic("Yourself", [
                            q("What are you up to?", ["Ah. You see, my notes were scattered in the wind.", "I am trying to recover them. You look resourceful.", "Maybe you can help?"]),
                        ]),
                    ],
                ),

            ),
            middle,
        );
    }
    public createAtast() {
        const pillar: TheniaDoodad = TheniaDoodad.pillar();
        const pillarCollapsed: TheniaDoodad = TheniaDoodad.pillarCollapsed();
        const [ax, ay] = this.atastLocation;
        const walls = [ pillarCollapsed, pillar ];

        this.createBuilding(walls, [ax + 10, ay], [ 10, 6 ], 2);

        for (let i = 0; i < 3; i++) {
            this.createBuilding(walls, [ax - 10  - (48 * i), ay - 28], [8, 10], 2);
        }
    }

    public createBuilding(wallObjects: TheniaDoodad[], location: Point, dims: Point, scale: number = 3, placementChance: number = 0.5): void {
        const [w, h] = dims;
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                if (x == 0 || y == 0 || x === w - 1 || y === h - 1) {
                    if (Math.random() < placementChance) {
                        const wallObject: TheniaDoodad = wallObjects[
                            getRandomInt(0, wallObjects.length)
                        ];
                        this.world.map.putDoodad(wallObject, [location[0] + x * scale, location[1] + y * scale]);
                    }
                }
            }
        }
    }

    public createQutb(): void {
        const [x, y] = this.qutbLocation;
        const lake: TheniaDoodad = TheniaDoodad.smallPool();
        const scale = 3; 
        const extent = 50;
        for (let dx = -extent; dx < extent; dx++) {
            for (let dy = -extent; dy < extent; dy++) {
                const s = scale - 1;
                const ex = x + (scale * dx) + getRandomInt(-s, s);
                const ey = y + (scale * dy) + getRandomInt(-s, s);
                const dist = distance([ex, ey], [x, y])
                const r = extent * scale;
                if (dist < r) {
                    if (Math.random() < 0.3 - (dist / r)) {
                        this.world.map.putDoodad(lake, [ex, ey]);
                    }
                }
            }
        }
    }

    public createOasisQuest(): Quest {
        const oasisLocation: Point = this.qutbLocation;
        const clueOneLocation: Point = [this.width / 2 - 15, this.height / 2 + 4];
        const clueTwoLocation: Point = this.atastLocation;
        const oasisQuest: Wonder = new Wonder("Qutb Oasis", "the Oasis");
        oasisQuest.clueLocations = [clueOneLocation, clueTwoLocation];
        oasisQuest.location = [oasisLocation[0] + 4, oasisLocation[1] + 6];
        const oasisClueOne: TheniaItem = TheniaItem.note(
            [`"...The Qutb Oasis, fed by the Kul springs,`,
`is a jewel of the endless Nem'ean sands located to the north--"`,
`There must be more to the message.`],
        );
        const oasisClueTwo: TheniaItem = TheniaItem.note(
            ['"--of the ancient ruins of Atast..."', "Okay!"]);
        this.world.map.placeItem(oasisClueOne, clueOneLocation);
        this.world.map.placeItem(oasisClueTwo, clueTwoLocation);
        const seekOasis = seekWonder(oasisQuest);
        return seekOasis;
    }
}
