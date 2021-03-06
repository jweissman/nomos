import { Scene, Color, Engine, Drawable } from "excalibur";
import { Wander } from "./Scenes/Wander";
import TheniaEngine from "./Models/Thenia";
import { SpriteDict } from "./Values/SpriteDict";
import Fly from "./Scenes/Fly";
import { Ride } from "./Scenes/Ride";
import { Meditate } from "./Scenes/Meditate";
import Talk from "./Scenes/Talk";
import Dialogue from "../ea/Dialogue";
import { TheniaPerson } from "./Models/Thenia/TheniaPerson";
import { Graphics } from "./Graphics";
import { Title } from "./Scenes/Title";
import species from "./Typography";

type DialogState = {
  dialogue: Dialogue,
  person: TheniaPerson,
  backgroundObjects: Drawable[]
}

export class Game extends Engine {
    static fonts = {
        primary: species.cat,
        secondary: species.man,
        ui: species.exo,
        title: species.advent,
    }
    public graphics: Graphics = new Graphics(this);

    public lastScene: string = '';

    constructor(
        private world: TheniaEngine,
        private sprites: (engine: Engine) => SpriteDict
    ) {
        super();
        this.backgroundColor = Color.fromRGB(220,180,160);
    }

    onInitialize() {
        let drawings: SpriteDict = this.sprites(this);
        let wander: Scene = new Wander(this, this.world, drawings);
        let fly: Scene = new Fly(this, this.world, drawings);
        let ride: Scene = new Ride(this, this.world, drawings);
        let talk: Scene = new Talk(this, drawings);
        let meditate: Scene = new Meditate(this, drawings);
        let welcome: Scene = new Title(this, drawings);
        this.addScene('wander', wander);
        this.addScene('fly', fly);
        this.addScene('ride', ride);
        this.addScene('meditate', meditate);
        this.addScene('talk', talk);
        this.addScene('welcome', welcome);
        this.goToScene('welcome');
    }

    dialogState: DialogState | null = null;
    startDialogue(person: TheniaPerson, dialogue: Dialogue, backgroundObjects: Drawable[] = []): void {
        this.dialogState = {
            person, dialogue, backgroundObjects
        }
    }

    get currentDialogue(): DialogState | null {
        return this.dialogState;
    }
}

export default Game;