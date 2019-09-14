import { Engine, Color, Sprite, Scene, Vector, Actor } from "excalibur";
import GridView, { TheniaView } from "../Actors/GridView";
import { GameController } from "../GameController";
import { Player } from "../Actors/Player";
import Thenia, { TheniaItem, TheniaDoodad, TheniaTerrain } from "../Models/Thenia";
import { Focus, Header, Subheader, Log } from "../Actors/UI";
import Point from "../Values/Point";
import { Resources } from "../Resources";

export class Wander extends Scene {
    ticks: number = 0;
    grid: TheniaView;
    player: Player<TheniaItem>;
    playerFocus: Focus;
    title: Header;
    subtitle: Subheader;
    log: Log;
    controller: GameController;

    constructor(private engine: Engine, private world: Thenia, private sprites: {
        [key: string]: Sprite;
    }) {
        super(engine);
        this.grid = new GridView<TheniaItem, TheniaDoodad, TheniaTerrain>(this.world, this.sprites);
        this.title = new Header("Nemian Desert", engine)
        this.subtitle = new Subheader("Seek the Oasis", engine)
        this.log = new Log("Welcome to the Desert", engine);
        this.player = new Player(this.world);
        this.player.addDrawing(Resources.Wanderer)
        this.playerFocus = new Actor(0,0,2,2,Color.White); // Focus();
        this.controller = new GameController(engine);
    }

    onInitialize() {
        this.add(this.grid);
        this.add(this.player);
        this.add(this.playerFocus);
        this.add(this.title);
        this.add(this.subtitle);
        this.add(this.log);
        // this.player.scale = new Vector(2,2)
        this.camera.strategy.lockToActor(this.player);
    }

    onActivate() {
        this.camera.zoom(2) //, 1000)
    }

    onPreUpdate() {
        let input = this.controller.state();
        let vec = new Vector(input.dx, input.dy);
        this.player.move(vec);

        if (this.player.viewing && this.player.viewingAt) {
            let it: TheniaItem = this.player.viewing;
            let focused: Point = this.player.viewingAt
            if (input.query) {
                this.log.setMessage(it.description)
            } else if (input.interact) {
                let result = this.world.interact(it, focused);
                if (result) {
                    this.log.setMessage(result);
                }
            }
            if (focused) {
                let sz = GridView.cellSize;
                this.playerFocus.pos.x = focused[0] * sz + sz / 2;
                this.playerFocus.pos.y = focused[1] * sz + 3 * sz / 4;
                this.playerFocus.visible = true;
                this.playerFocus.color = Color.White
            }
        } else {
            this.playerFocus.visible = false
        }

        if (input.zoom) {
            // this.playerFocux.opacity = 0.2
            this.engine.goToScene('fly')
            // this.camera.zoom(1.0, 2000).then(() => this.engine.goToScene('fly'));
        }

        this.world.setPlayerPosition(this.player.pos.x, this.player.pos.y)
    }
}
