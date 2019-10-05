import path from 'path';
import { Texture, SpriteSheet } from "excalibur"

// @ts-ignore
const asset = (img: string) => path.join(__static, "assets", img)

export const Resources: { [key: string]: Texture } = {
    Tree: new Texture(asset("tree.png")),
    Rock: new Texture(asset("stone.png")),
    Territory: new Texture(asset("territory.png")),
    Wanderer: new Texture(asset("wanderer.png")),
    Items: new Texture(asset("items.png")),
    Doodads: new Texture(asset("doodads.png")),
    Bird: new Texture(asset("bird.png")),
    Mouse: new Texture(asset("mouse.png")),
    Horse: new Texture(asset("horse.png")),
    Animals: new Texture(asset("desert-animals.png")),
    Wight: new Texture(asset("wight.png")),
    Bandit: new Texture(asset("bandit.png")),
    Oasis: new Texture(asset("oasis-lake.png")),
    Bones: new Texture(asset("bones.png")),
    Pillar: new Texture(asset("column.png")),
    SmallPool: new Texture(asset("small-pool.png")),
    Sheep: new Texture(asset("sheep.png")),
}

export const SpriteSheets: { [key: string]: SpriteSheet } = {
    Terrain: new SpriteSheet(Resources.Territory, 2, 4, 64, 64),
    Items: new SpriteSheet(Resources.Items, 4, 2, 64, 64),
    Doodads: new SpriteSheet(Resources.Doodads, 2, 2, 64, 64),
    BirdFlying: new SpriteSheet(Resources.Bird, 2, 2, 128, 128),
    HorseRiding: new SpriteSheet(Resources.Horse, 2, 2, 128, 128),
    Wandering: new SpriteSheet(Resources.Wanderer, 1, 15, 128, 128),
    Animals: new SpriteSheet(Resources.Animals, 4, 4, 64, 64),
    Wight: new SpriteSheet(Resources.Wight, 3, 1, 64, 64),
    Bandit: new SpriteSheet(Resources.Bandit, 16, 1, 64, 64),
    Oasis: new SpriteSheet(Resources.Oasis, 1, 4, 512,512),
    SmallPool: new SpriteSheet(Resources.SmallPool, 2, 1, 128, 128),
    Pillar: new SpriteSheet(Resources.Pillar, 2, 1, 128, 128),
    Sheep: new SpriteSheet(Resources.Sheep, 1, 8, 64, 64),
}