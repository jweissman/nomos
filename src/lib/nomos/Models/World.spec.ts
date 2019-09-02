import Thenia from "./Thenia";


describe("World", () => {
    let world: Thenia = new Thenia({
        dimensions: [3, 3],
    });
    it('models a grid of things', () => {
        // world.put({ value: 'tree', position: [0, 2] });
        expect(world.assembleGrid()).toEqual([
            [0,0,0],
            [0,0,0],
            [0,0,0],
        ]);
        expect(world.listEntities()).toEqual([
            { kind: 'nothing', isNothing: true },
            { kind: 'tree', isNothing: false },
        ])
    });
    it('adds values to the grid', () => {
        world.put(1, [1,2])
        expect(world.assembleGrid()).toEqual([
            [0,0,0],
            [0,0,0],
            [0,1,0],
        ]);
    })
})