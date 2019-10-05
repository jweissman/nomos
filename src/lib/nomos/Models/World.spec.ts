import TheniaEngine from "./Thenia";

describe("World", () => {
    let world: TheniaEngine = new TheniaEngine();
    it('models a grid of things', () => {
        // world.put({ value: 'tree', position: [0, 2] });
        expect(world.map.assembleDoodads()).toEqual([
            [0,0,0],
            [0,0,0],
            [0,0,0],
        ]);
    });
    it('describes entities', () => {
        expect(world.map.listDoodadKinds()).toEqual([
            { kind: 'nothing', isNothing: true },
            { kind: 'tree', isNothing: false },
        ])
    });
    // it('adds values to the grid', () => {
    //     // world.putDoodad(1, [1,2])
    //     expect(world.assembleDoodads()).toEqual([
    //         [0,0,0],
    //         [0,0,0],
    //         [0,1,0],
    //     ]);
    // })

    it.skip('tracks player movement', () => {
        // world.teleport([2,2])
    })
})