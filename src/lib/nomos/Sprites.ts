import { Engine } from "excalibur";
import { SpriteDict } from "./Values/SpriteDict";
import { SpriteSheets, Resources } from "./Resources";

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
    let littleCactus = SpriteSheets.Doodads.getSprite(3);
    let oasis = SpriteSheets.Oasis.getAnimationForAll(engine, 450);
    let bones = Resources.Bones.asSprite();
    let pillar = SpriteSheets.Pillar.getSprite(0);
    let pillarCollapsed = SpriteSheets.Pillar.getSprite(1);

    let grass = SpriteSheets.Terrain.getSprite(0);
    let flowers = SpriteSheets.Terrain.getSprite(1);
    let scrub = SpriteSheets.Terrain.getSprite(2);
    let stone = SpriteSheets.Terrain.getSprite(3);

    let coin = SpriteSheets.Items.getSprite(0);
    let root = SpriteSheets.Items.getSprite(1);
    let letter = SpriteSheets.Items.getSprite(2);
    let chest = SpriteSheets.Items.getSprite(3);
    let coinCollected = SpriteSheets.Items.getSprite(4);
    let rootGathered = SpriteSheets.Items.getSprite(5);
    let letterRead = SpriteSheets.Items.getSprite(6);
    let chestOpened = SpriteSheets.Items.getSprite(7);

    const bandit = SpriteSheets.Bandit.getSprite(0);
    const banditWalk = SpriteSheets.Bandit.getAnimationBetween(engine, 0, 5, 300);
    const banditDead = SpriteSheets.Bandit.getSprite(8);
    const banditReady = SpriteSheets.Bandit.getSprite(4);
    const banditGuard = SpriteSheets.Bandit.getSprite(9);
    const banditAlert = SpriteSheets.Bandit.getSprite(12);
    const banditAlertWalk = SpriteSheets.Bandit.getAnimationBetween(engine, 12, 16, 150);
    const banditSearch = SpriteSheets.Bandit.getSprite(11);
    const banditAttack = SpriteSheets.Bandit.getAnimationBetween(engine, 5, 7, 200)

    let doodads = {
        cactus: littleCactus, bigCactus: bigCactus, rock: pebble, shrub: reed,
        oasis, bones, pillar, pillarCollapsed,
    }

    let sprites: SpriteDict = {
        ...doodads,
        grass, flowers, scrub, stone,
        coin, root, letter, chest,
        coinCollected, rootGathered, letterRead, chestOpened,
        mouse, scorpion, lizard, snake,
        horse, horseRiding,
        bandit, banditDead,
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