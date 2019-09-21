import { Thing, Doodad, Terrain, Creature } from "../World"

interface Nothing extends Thing {
    kind: 'nothing'
    isNothing: true
    size: -1
}

export const zed: () => Nothing = () => { return { kind: 'nothing', isNothing: true, size: -1 } }

interface SimpleDoodad extends Doodad {
    isNothing: false
    canBeGathered: false
    size: number
}

interface Tree extends SimpleDoodad {
    kind: 'tree'
}

interface Rock extends SimpleDoodad {
    kind: 'rock'
}

interface Shrub extends SimpleDoodad {
    kind: 'shrub'
}

export const tree: () => Tree = () => { return { kind: 'tree', size: 2, isNothing: false, canBeGathered: false } }
export const rock: () => Rock = () => { return { kind: 'rock', size: 1, isNothing: false, canBeGathered: false } }
export const shrub: () => Shrub = () => { return { kind: 'shrub', size: 1, isNothing: false, canBeGathered: false }}

export type TheniaDoodad = Nothing | Tree | Rock | Shrub

interface Dirt extends Terrain {
    kind: 'dirt'
}
interface Grass extends Terrain {
    kind: 'grass'
}
interface Water extends Terrain {
    kind: 'water'
}

export const dirt: () => Dirt = () => { return { kind: 'dirt', isNothing: false }}
export const grass: () => Grass = () => { return { kind: 'grass', isNothing: false }}
export const water: () => Water = () => { return { kind: 'water', isNothing: false }}

export type TheniaTerrain = Nothing | Dirt | Grass | Water

export class TheniaCreature implements Creature {
    static none(): TheniaCreature {
        let nullCritter = new TheniaCreature('nothing', 'not a creature', 'abyssus')
        nullCritter.isNothing = true
        return nullCritter
    }
    state: { [key: string]: any } = { visible: true }
    isNothing = false

    static mouse = () => new TheniaCreature('mouse', 'a tiny creature', 'mousus desertus');
    static scorpion = () => new TheniaCreature('scorpion', 'a bit sharp', 'stingus abunchus');
    static lizard = () => new TheniaCreature('lizard', 'little guy', 'slinkus aroundus');
    static snake = () => new TheniaCreature('snake', 'nice viper', 'smoothus curvus');
    static horse = () => new TheniaCreature('horse', 'a majestic beast', 'hippus capabillus');

    constructor(
        public name: string,
        public description: string,
        public species: string,
    ) {}
    get kind() { return this.name; }
}