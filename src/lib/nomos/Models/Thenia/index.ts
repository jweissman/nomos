import Thenia from './Thenia';
import GridView from '../../Actors/GridView';
import { TheniaDoodad, TheniaTerrain, TheniaCreature } from './Structures';
import { TheniaItem } from './TheniaItem';
import { Creature, Item, Doodad, Terrain } from '../World';

export class WorldView extends GridView<Creature, Item, Doodad, Terrain> {};
export class TheniaView extends GridView<TheniaCreature, TheniaItem, TheniaDoodad, TheniaTerrain> {}
export default Thenia;