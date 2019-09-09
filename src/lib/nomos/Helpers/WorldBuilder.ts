import Thenia, { TheniaItem } from "../Models/Thenia";
import Point from "../Values/Point";

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
    let world = new Thenia();
    const common = 0.18;
    const uncommon = common / 4;
    const rare = uncommon / 4;
    const epic = rare / 4;

    forEachRandomPosition(world.dimensions, common, ([x,y]) => { 
        let terrain = 1 + Math.floor(Math.random() * (world.listTerrainKinds().length - 1));
        world.setTerrain(terrain, [x, y])
    })

    forEachRandomPosition(world.dimensions, uncommon, ([x, y]) => { 
        let entity = 1 + Math.floor(Math.random() * (world.listDoodads().length - 1));
        world.putDoodad(entity, [x, y]);
    })

    forEachRandomPosition(world.dimensions, rare, ([x, y]) => { 
        world.placeItem(TheniaItem.root(), [x,y]);
    })
    forEachRandomPosition(world.dimensions, epic, ([x, y]) => { 
        world.placeItem(TheniaItem.coin(), [x,y]);
    })
    return world;
}

export default genWorld;