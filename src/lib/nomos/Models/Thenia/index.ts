import TheniaEngine from "./Thenia";
import GridView from '../../Actors/GridView';
import { TheniaDoodad } from "./TheniaDoodad";
import { TheniaTerrain } from "./TheniaTerrain";
import { TheniaCreature } from "./TheniaCreature";
import { TheniaEnemy } from "./TheniaEnemy";
import { TheniaItem } from './TheniaItem';
import { Creature, Item, Doodad, Terrain, Enemy } from '../World';

export class WorldView extends GridView<Enemy, Creature, Item, Doodad, Terrain> {};
export class TheniaView extends GridView<TheniaEnemy, TheniaCreature, TheniaItem, TheniaDoodad, TheniaTerrain> {}
export default TheniaEngine;