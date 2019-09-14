import { Texture, SpriteSheet } from "excalibur"

export const Resources: { [key: string]: Texture } = {
    Tree: new Texture("/assets/tree.png"),
    Rock: new Texture("/assets/stone.png"),
    Territory: new Texture("/assets/territory.png"),
    Wanderer: new Texture("/assets/wanderer.png"),
    Items: new Texture("/assets/items.png"),
    Doodads: new Texture("/assets/doodads.png"),
    Bird: new Texture("/assets/bird.png"),
}

export const SpriteSheets: { [key: string]: SpriteSheet } = {
    Terrain: new SpriteSheet(Resources.Territory, 2, 4, 64, 64),
    Items: new SpriteSheet(Resources.Items, 2, 2, 64, 64),
    Doodads: new SpriteSheet(Resources.Doodads, 2, 2, 64, 64),
    BirdFlying: new SpriteSheet(Resources.Bird, 2, 1, 64, 64),
}