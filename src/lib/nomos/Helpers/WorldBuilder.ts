import TheniaEngine from "../Models/Thenia";
import Point from "../Values/Point";
import { TheniaItem } from "../Models/Thenia/TheniaItem";
import { TheniaCreature } from "../Models/Thenia/TheniaCreature";
import { Worldlike } from "../../ea/World";
import { TheniaEnemy } from "../Models/Thenia/TheniaEnemy";

let rareDoodads = 6; // assumes desert terrain is 'up front'
let rareTerrain = 4;
const base = 0.15
const ubiq = 0.1275
const common  = 0.023675

function forEachRandomPosition(dims: Point, threshold: number, max: number = 1000, cb: (p: Point) => void) {
    let [dx,dy] = dims;
    let extent = dx * dy;
    let n = extent * threshold;
    for (let i = 0; i < n; i++) {
        let [x, y] = [
            Math.floor(Math.random() * dx),
            Math.floor(Math.random() * dy),
        ];
        cb([x,y]);
    }
}

const rarities: { [key: string]: number } = {
    base,
    ubiquitous: ubiq,
    common: Math.pow(common, 1),
    uncommon: Math.pow(common, 2),
    rare: Math.pow(common/2, 2),
    epic: Math.pow(common/3, 2),
    legendary: Math.pow(common/4, 2),
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
        lizard: 'uncommon',
        mouse: 'uncommon',
        snake: 'uncommon',
        sheep: 'rare',
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

function findUnblockedPointNear(world: Worldlike, point: Point, radius: number = 24) {
    let tries = 0;
    let [x,y] = point
    let r = radius
    let target: Point = [
        x + randomValue(-r,r),
        y + randomValue(-r,r)
    ]
    while (world.map.isBlocked(target) && tries++ < 100) {
        target = [
            x + randomValue(-r,r),
            y + randomValue(-r,r)
        ]
    }
    return target;
 
}

function genWorld(world: TheniaEngine): TheniaEngine {
    spawnRandomly(world, 'ubiquitous', 10000, ([x, y]) => {
        let entityIndex = 1 + Math.floor(Math.random() * (world.map.listDoodadKinds().length - 1 - rareDoodads));
        if (Math.random() < 0.0001) {
            entityIndex = 1 + Math.floor(Math.random() * (world.map.listDoodadKinds().length - 1));
        }
        let doodad = world.map.listDoodadKinds()[entityIndex]
        let isBlocked = world.map.isBlocked([x, y], 2)
        if (!isBlocked) {
            world.map.putDoodad(doodad, [x, y]);
        }
    })

    spawnRandomly(world, 'base', 1000000, ([x,y]) => {
        let kinds = world.map.listTerrainKinds();
        let terrain = 1 + Math.floor(Math.random() * (kinds.length - 1 - rareTerrain));
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
    // let banditPartyCount = 3;
    // for (let i = 0; i < banditPartyCount; i++) {
    //     let middle = findUnblockedPointNear(world, [width / 2, height / 2])
    //     world.map.spawnEnemy(TheniaEnemy.bandit(), middle);
    // }
    let middleAgain = findUnblockedPointNear(world, [width/2,height/2])
    world.map.spawnCritter(TheniaCreature.horse(), middleAgain);
    middleAgain = findUnblockedPointNear(world, [width/2,height/2])
    world.map.spawnCritter(TheniaCreature.sheep(), middleAgain);
    middleAgain = findUnblockedPointNear(world, [width/2,height/2])
    world.map.spawnCritter(TheniaCreature.sheep(), middleAgain);
    middleAgain = findUnblockedPointNear(world, [width/2,height/2])
    world.map.spawnCritter(TheniaCreature.sheep(), middleAgain);

    return world;
}

export default genWorld;