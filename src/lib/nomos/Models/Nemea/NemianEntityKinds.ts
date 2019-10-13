import { TheniaDoodad } from "../Thenia/TheniaDoodad";
import { TheniaCreature } from "../Thenia/TheniaCreature";
import { TheniaItem } from "../Thenia/TheniaItem";
import { TheniaEnemy } from "../Thenia/TheniaEnemy";
import { TheniaTerrain } from "../Thenia/TheniaTerrain";
import { EntityKinds } from "../../../ea/Cartogram";
import { TheniaPerson } from "../Thenia/TheniaPerson";
import { conversation } from "../../../ea/Dialogue";

const doodadKinds: TheniaDoodad[] = [
    TheniaDoodad.none(),
    TheniaDoodad.rock(),
    TheniaDoodad.cactus(),
    TheniaDoodad.bigCactus(),
    TheniaDoodad.shrub(),
    TheniaDoodad.crystal(),
    TheniaDoodad.bones(),
    TheniaDoodad.pillar(),
    TheniaDoodad.pillarCollapsed(),
    TheniaDoodad.smallPool(),
 
];
const creatureKinds: TheniaCreature[] = [
    TheniaCreature.none(),
    TheniaCreature.mouse(),
    TheniaCreature.horse(),
    TheniaCreature.sheep(),
    TheniaCreature.scorpion(),
    TheniaCreature.lizard(),
];
const itemKinds: TheniaItem[] = [
    TheniaItem.none(),
    TheniaItem.coin(),
    TheniaItem.coin({ spriteName: 'coinCollected', collected: true, }),
    TheniaItem.root(),
    TheniaItem.root({ spriteName: 'rootGathered', collected: true, }),
    TheniaItem.note(['abstract message']),
    TheniaItem.note(['the message has been received'], { spriteName: 'letterRead', collected: true, }),
];

const enemyKinds: TheniaEnemy[] = [
    TheniaEnemy.none(),
    TheniaEnemy.bandit(),
];

const terrainKinds: TheniaTerrain[] = [
    TheniaTerrain.none(),
    TheniaTerrain.scrub(),
    TheniaTerrain.grass(),
    TheniaTerrain.flowers(),
    TheniaTerrain.stone(),
    TheniaTerrain.forms(),
    TheniaTerrain.stars(),
    TheniaTerrain.fineGrid(),
    TheniaTerrain.roughGrid(),
];

const peopleKinds: TheniaPerson[] = [
    TheniaPerson.none(),
    TheniaPerson.wiseMan(conversation('abstract persona', [])),
]

export type NemianKinds = EntityKinds<TheniaEnemy, TheniaCreature, TheniaItem, TheniaDoodad, TheniaTerrain, TheniaPerson> 

const nemianKinds: NemianKinds = { 
    terrain: terrainKinds,
    enemies: enemyKinds,
    item: itemKinds,
    doodad: doodadKinds,
    creature: creatureKinds,
    people: peopleKinds,
}

export default nemianKinds;