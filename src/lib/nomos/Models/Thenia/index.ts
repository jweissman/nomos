import TheniaEngine from "./Thenia";
import GridView from '../../Actors/GridView';
import { TheniaDoodad } from "./TheniaDoodad";
import { TheniaTerrain } from "./TheniaTerrain";
import { TheniaCreature } from "./TheniaCreature";
import { TheniaEnemy } from "./TheniaEnemy";
import { TheniaItem } from './TheniaItem';
import { Creature, Item, Doodad, Terrain, Enemy, Person } from '../../../ea/World';
import { TheniaPerson } from "./TheniaPerson";

export class WorldView extends GridView<Enemy, Creature, Item, Doodad, Terrain, Person> {};
export class TheniaView extends GridView<TheniaEnemy, TheniaCreature, TheniaItem, TheniaDoodad, TheniaTerrain, TheniaPerson> {}
export default TheniaEngine;