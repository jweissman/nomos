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
    console.log("----> GEN WORLD");
    let sz = GridView.cellSize;
    let world = new Thenia();
    const base = 0.04; 
    const common = base / 3;
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

    forEachRandomPosition(world.dimensions, rare, ([x, y]) => { 
        world.spawnCritter(TheniaCreature.mouse(), [x*sz,y*sz]);
    })

    forEachRandomPosition(world.dimensions, epic, ([x, y]) => { 
        world.spawnCritter(TheniaCreature.horse(), [x*sz,y*sz]);
    })

    let [width,height] = world.dimensions
    let middle: Point = [
        // 300,300
        width/2 * sz,
        height/2 * sz,
    ]
    console.log("Spawn middle point: " + middle)
    world.spawnCritter(TheniaCreature.mouse(), middle);
    world.spawnCritter(TheniaCreature.mouse(), middle);
    world.spawnCritter(TheniaCreature.horse(), middle);

    console.log("----> WORLD GENERATED", { world });
    return world;
}

export default genWorld;