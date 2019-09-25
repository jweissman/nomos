import { Engine, Vector } from "excalibur";
import { SpriteDict } from "./Values/SpriteDict";
import { SpriteSheets } from "./Resources";

export default function assembleSprites(engine: Engine): SpriteDict {
    let mouse = SpriteSheets.Animals.getAnimationBetween(engine, 0, 4, 250);
    let scorpion = SpriteSheets.Animals.getAnimationBetween(engine, 4, 8, 160);
    let lizard = SpriteSheets.Animals.getAnimationBetween(engine, 8, 12, 180);
    let snake = SpriteSheets.Animals.getAnimationBetween(engine, 12, 16, 120);

    let horse = SpriteSheets.HorseRiding.getSprite(0);
    let horseRiding = SpriteSheets.HorseRiding.getSprite(1);

    let pebble = SpriteSheets.Doodads.getSprite(0);
    let reed = SpriteSheets.Doodads.getSprite(1);
    let bigCactus = SpriteSheets.Doodads.getSprite(2);
    bigCactus.scale = new Vector(2, 2)
    let littleCactus = SpriteSheets.Doodads.getSprite(3);

    let grass = SpriteSheets.Terrain.getSprite(0);
    let flowers = SpriteSheets.Terrain.getSprite(1);
    let scrub = SpriteSheets.Terrain.getSprite(2);
    let stone = SpriteSheets.Terrain.getSprite(3);

    let coin = SpriteSheets.Items.getSprite(0);
    let root = SpriteSheets.Items.getSprite(1);
    let coinCollected = SpriteSheets.Items.getSprite(2);
    let rootGathered = SpriteSheets.Items.getSprite(3);

    const bandit = SpriteSheets.Bandit.getSprite(0);
    const banditWalk = SpriteSheets.Bandit.getAnimationBetween(engine, 0, 5, 300);
    const banditDead = SpriteSheets.Bandit.getSprite(8);
    const banditReady = SpriteSheets.Bandit.getSprite(4);
    const banditGuard = SpriteSheets.Bandit.getSprite(9);
    const banditAlert = SpriteSheets.Bandit.getSprite(12);
    const banditAlertWalk = SpriteSheets.Bandit.getAnimationBetween(engine, 12, 16, 150);
    const banditSearch = SpriteSheets.Bandit.getSprite(11);
    const banditAttack = SpriteSheets.Bandit.getAnimationBetween(engine, 5, 7, 200)

    let sprites: SpriteDict = {
        cactus: littleCactus, bigCactus: bigCactus, rock: pebble, shrub: reed,
        grass, flowers, scrub, stone,
        coin, root,
        coinCollected, rootGathered,
        mouse, scorpion, lizard, snake,
        horse, horseRiding,
        bandit,
        banditDead,
        'bandit-ready': banditReady,
        'bandit-guard': banditGuard,
        'bandit-alert': banditAlert,
        'bandit-search': banditSearch,
        'bandit-walk': banditWalk,
        'bandit-alert-walk': banditAlertWalk,
        'bandit-attack': banditAttack,
    };
    return sprites;
}