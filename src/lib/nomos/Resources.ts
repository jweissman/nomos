import { Texture, SpriteSheet } from "excalibur"

export const Resources: { [key: string]: Texture } = {
    Tree: new Texture("/assets/tree.png"),
    Rock: new Texture("/assets/stone.png"),
    Territory: new Texture("/assets/territory.png"),
    Wanderer: new Texture("/assets/wanderer.png"),
    Items: new Texture("/assets/items.png"),
    Doodads: new Texture("/assets/doodads.png"),
    Bird: new Texture("/assets/bird.png"),
    Mouse: new Texture("/assets/mouse.png"),
    Horse: new Texture("/assets/horse.png"),
    Animals: new Texture("/assets/desert-animals.png"),
    Wight: new Texture("/assets/wight.png"),
    Bandit: new Texture("/assets/bandit.png"),
}

export const SpriteSheets: { [key: string]: SpriteSheet } = {
    Terrain: new SpriteSheet(Resources.Territory, 2, 4, 64, 64),
    Items: new SpriteSheet(Resources.Items, 2, 2, 64, 64),
    Doodads: new SpriteSheet(Resources.Doodads, 2, 2, 64, 64),
    BirdFlying: new SpriteSheet(Resources.Bird, 2, 2, 128, 128),
    HorseRiding: new SpriteSheet(Resources.Horse, 2, 2, 128, 128),
    Wandering: new SpriteSheet(Resources.Wanderer, 4, 2, 128, 128),
    Animals: new SpriteSheet(Resources.Animals, 4, 4, 64, 64),
    Wight: new SpriteSheet(Resources.Wight, 3, 1, 64, 64),
    Bandit: new SpriteSheet(Resources.Bandit, 11, 1, 64, 64),
}