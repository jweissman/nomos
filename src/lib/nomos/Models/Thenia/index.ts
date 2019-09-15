import Thenia from './Thenia';
import GridView from '../../Actors/GridView';
import { TheniaDoodad, TheniaTerrain, TheniaCreature } from './Structures';
import { TheniaItem } from './TheniaItem';

export class TheniaView extends GridView<TheniaCreature, TheniaItem, TheniaDoodad, TheniaTerrain> {}
export default Thenia;