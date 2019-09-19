import Thenia from "../Models/Thenia";
import Point from "../Values/Point";
import { TheniaItem } from "../Models/Thenia/TheniaItem";
import { TheniaCreature } from "../Models/Thenia/Structures";
import GridView from "../Actors/GridView";

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

function genWorld(): Thenia {
    let sz = GridView.cellSize;
    let world = new Thenia();
    const base = 0.08; 
    const common = base * base;
    const uncommon = common / 5;
    const rare = uncommon / 8;
    const epic = rare / 13;

    forEachRandomPosition(world.dimensions, base, ([x,y]) => { 
        let terrain = 1 + Math.floor(Math.random() * (world.listTerrainKinds().length - 1));
        world.setTerrain(terrain, [x, y])
    })

    forEachRandomPosition(world.dimensions, common, ([x, y]) => { 
        let entityIndex = 1 + Math.floor(Math.random() * (world.listDoodads().length - 1));
        let doodad = world.listDoodads()[entityIndex]
        world.putDoodad(doodad, [x, y]);
    })

    forEachRandomPosition(world.dimensions, rare, ([x, y]) => { 
        world.placeItem(TheniaItem.root(), [x,y]);
    })

    forEachRandomPosition(world.dimensions, epic, ([x, y]) => { 
        world.placeItem(TheniaItem.coin(), [x,y]);
    })

    forEachRandomPosition(world.dimensions, uncommon, ([x, y]) => { 
        world.spawnCritter(TheniaCreature.mouse(), [x*sz,y*sz]);
    })

    forEachRandomPosition(world.dimensions, rare, ([x, y]) => { 
        world.spawnCritter(TheniaCreature.scorpion(), [x*sz,y*sz]);
    })

    forEachRandomPosition(world.dimensions, epic, ([x, y]) => { 
        world.spawnCritter(TheniaCreature.horse(), [x*sz,y*sz]);
    })

    let [width,height] = world.dimensions
    let middle: Point = [
        width/2 * sz + 14,
        height/2 * sz + 30,
    ]
    // world.spawnCritter(TheniaCreature.mouse(), middle);
    world.spawnCritter(TheniaCreature.horse(), middle);

    return world;
}

export default genWorld;