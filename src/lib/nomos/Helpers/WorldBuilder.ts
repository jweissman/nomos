import Thenia from "../Models/Thenia";
import Point from "../Values/Point";
import { TheniaItem } from "../Models/Thenia/TheniaItem";
import { TheniaCreature } from "../Models/Thenia/TheniaCreature";
import { Worldlike } from "../Models/World";
import { TheniaEnemy } from "../Models/Thenia/TheniaEnemy";

function forEachRandomPosition(dims: Point, threshold: number, max: number = 1000, cb: (p: Point) => void) {
    let [dx,dy] = dims;
    let extent = dx * dy;
    for (let i = 0; i < Math.min(max,extent * threshold); i++) {
        let [x, y] = [
            Math.floor(Math.random() * dx),
            Math.floor(Math.random() * dy),
        ];
        cb([x,y]);
    }
}

const base = 0.15
const rarities: { [key: string]: number } = {
    base,
    ubiquitous: base/2,
    common: Math.pow(base, 2),
    uncommon: Math.pow(base/2, 2),
    rare: Math.pow(base, 3),
    epic: Math.pow(base/4, 3),
    legendary: Math.pow(base/4, 4),
}

type Rarity = 'base' | 'ubiquitous' | 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

function spawnRandomly(world: Worldlike, rarity: Rarity, max: number, cb: (p: Point) => void) {
    forEachRandomPosition(world.dimensions, rarities[rarity], max, ([x, y]) => { 
        if (!world.map.isBlocked([x,y])) {
            cb([x,y])
        }
    })
}

function genCritters(world: Worldlike) {
    const critterRarities = {
        mouse: 'uncommon',
        lizard: 'uncommon',
        snake: 'rare',
        scorpion: 'epic',
        horse: 'legendary',
    }
    Object.entries(critterRarities).forEach(([critterName, rarity]) => {
        spawnRandomly(world, rarity as Rarity, 1000, ([x, y]) => {
            // @ts-ignore
            let fn = TheniaCreature[critterName];
            world.map.spawnCritter(fn(), [x, y]);
        })
    })
}

const randomValue: (min: number, max: number) => number =
    (min: number, max: number) => Math.round(min + (Math.random() * (max-min)))
function findUnblockedPointNear(world: Worldlike, point: Point, radius: number = 16) {
    let tries = 0;
    let [x,y] = point
    let r = radius
    let target: Point = [
        x + randomValue(-r,r),
        y + randomValue(-r,r)
    ]
    while (world.map.isBlocked(target) && tries++ < 10) {
        target = [
            x + randomValue(-r,r),
            y + randomValue(-r,r)
        ]
    }
    return target;
 
}

function genWorld(): Thenia {
    let world = new Thenia();
    spawnRandomly(world, 'ubiquitous', 1000000, ([x, y]) => {
        let entityIndex = 1 + Math.floor(Math.random() * (world.map.listDoodadKinds().length - 1));
        let doodad = world.map.listDoodadKinds()[entityIndex]
        let isBlocked = world.map.isBlocked([x, y], doodad.size)
        if (!isBlocked) {
            // console.log("place doodad")
            world.map.putDoodad(doodad, [x, y]);
        } else {
            // console.log("blocked from placing doodad")
        }
    })

    spawnRandomly(world, 'base', 1000000, ([x,y]) => {
        let kinds = world.map.listTerrainKinds();
        let terrain = 1 + Math.floor(Math.random() * (kinds.length - 1));
        world.map.setTerrain(kinds[terrain], [x, y])
    })

    spawnRandomly(world, 'uncommon', 10000, ([x,y]) => {
        world.map.placeItem(TheniaItem.root(), [x,y]);
    })

    spawnRandomly(world, 'rare', 1000, ([x,y]) => {
        world.map.placeItem(TheniaItem.coin(), [x,y]);
    })

    spawnRandomly(world, 'uncommon', 10000, ([x,y]) => {
        world.map.spawnEnemy(TheniaEnemy.bandit(), [x,y]);
    })

    genCritters(world)

    let [width,height] = world.dimensions
    let banditPartyCount = 15;
    for (let i = 0; i < banditPartyCount; i++) {
        let middle = findUnblockedPointNear(world, [width / 2, height / 2])
        world.map.spawnEnemy(TheniaEnemy.bandit(), middle);
    }
    let middleAgain = findUnblockedPointNear(world, [width/2,height/2])
    world.map.spawnCritter(TheniaCreature.horse(), middleAgain);


    return world;
}

export default genWorld;