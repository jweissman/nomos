import { Engine, Scene } from "excalibur";
import { Header, Subheader, Log } from "../Actors/UI";
export class Hud {
    title: Header;
    subtitle: Subheader;
    log: Log;
    constructor(engine: Engine, private scene: Scene) {
        this.title = new Header("Nemian Desert", engine);
        this.subtitle = new Subheader("Seek the Oasis", engine);
        this.log = new Log("Welcome to the Desert", engine);
    }
    setup() {
        this.scene.add(this.title);
        this.scene.add(this.subtitle);
        this.scene.add(this.log);
    }
}
