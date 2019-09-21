import Thenia from "../Models/Thenia";
import Point from "../Values/Point";
import { TheniaItem } from "../Models/Thenia/TheniaItem";
import { TheniaCreature } from "../Models/Thenia/TheniaCreature";
import { Worldlike } from "../Models/World";

function forEachRandomPosition(dims: Point, threshold: number, cb: (p: Point) => void) {
    let [dx,dy] = dims;
    let extent = dx * dy;
    for (let i = 0; i < extent * threshold; i++) {
        let [x, y] = [
            Math.floor(Math.random() * dx),
            Math.floor(Math.random() * dy),
        ];
        cb([x,y]);
    }
}

const base = 0.2;
const baseSquared = base * base;
const rarities: { [key: string]: number } = {
    base,
    common: base * base,
    uncommon: baseSquared * base,
    rare: baseSquared * baseSquared * base,
    epic: Math.pow(baseSquared, 4),
    legendary: Math.pow(baseSquared, 10),
}

type Rarity = 'base' | 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

function spawnRandomly(world: Worldlike, rarity: Rarity, cb: (p: Point) => void) {
    forEachRandomPosition(world.dimensions, rarities[rarity], ([x, y]) => { 
        if (!world.map.isBlocked([x,y])) {
            cb([x,y])
        }
    })
}

function genWorld(): Thenia {
    let world = new Thenia();
    spawnRandomly(world, 'common', ([x, y]) => {
        console.log("SPAWN DOODAD", { x, y })
        let entityIndex = 1 + Math.floor(Math.random() * (world.map.listDoodadKinds().length - 1));
        let doodad = world.map.listDoodadKinds()[entityIndex]
        let isBlocked = world.map.isBlocked([x, y], doodad.size)
        if (!isBlocked) {
            world.map.putDoodad(doodad, [x, y]);
        } else {
            console.log("blocked from placing doodad")
        }
    })

    spawnRandomly(world, 'common', ([x,y]) => {
        let kinds = world.map.listTerrainKinds();
        let terrain = 1 + Math.floor(Math.random() * (kinds.length - 1));
        world.map.setTerrain(kinds[terrain], [x, y])
    })

    spawnRandomly(world, 'rare', ([x,y]) => {
        world.map.placeItem(TheniaItem.root(), [x,y]);
    })

    spawnRandomly(world, 'legendary', ([x,y]) => {
        world.map.placeItem(TheniaItem.coin(), [x,y]);
    })

    spawnRandomly(world, 'rare', ([x,y]) => {
        world.map.spawnCritter(TheniaCreature.mouse(), [x,y]);
    })

    spawnRandomly(world, 'epic', ([x,y]) => {
        world.map.spawnCritter(TheniaCreature.lizard(), [x,y]);
    })

    spawnRandomly(world, 'epic', ([x,y]) => {
        world.map.spawnCritter(TheniaCreature.snake(), [x,y]);
    })

    spawnRandomly(world, 'legendary', ([x,y]) => {
        world.map.spawnCritter(TheniaCreature.scorpion(), [x,y]);
    })

    spawnRandomly(world, 'legendary', ([x,y]) => {
        world.map.spawnCritter(TheniaCreature.horse(), [x,y]);
    })

    let [width,height] = world.dimensions
    let middle: Point = [
        width/2,
        height/2,
    ]
    world.map.spawnCritter(TheniaCreature.snake(), middle);
    world.map.spawnCritter(TheniaCreature.horse(), middle);

    return world;
}

export default genWorld;