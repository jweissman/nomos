import { Engine, Color, Sprite, Scene, Vector, Actor, Effects } from "excalibur";
import GridView from "../Actors/GridView";
import { GameController, InputState } from "../GameController";
import { Player } from "../Actors/Player";
import Thenia, { TheniaView } from "../Models/Thenia";
import { Focus, Header, Subheader, Log } from "../Actors/UI";
import Point from "../Values/Point";
import { Resources } from "../Resources";
import { TheniaItem } from "../Models/Thenia/TheniaItem";
import { TheniaCreature } from "../Models/Thenia/Structures";

export class Wander extends Scene {
    static zoom: number = 1;
    ticks: number = 0;
    grid: TheniaView;
    player: Player<TheniaItem, TheniaCreature>;
    playerFocus: Focus;
    title: Header;
    subtitle: Subheader;
    log: Log;
    controller: GameController;
    leaving: boolean = false;

    constructor(private engine: Engine, private world: Thenia, private sprites: {
        [key: string]: Sprite;
    }) {
        super(engine);
        this.grid = new TheniaView(this.world, this.sprites);
        this.title = new Header("Nemian Desert", engine);
        this.subtitle = new Subheader("Seek the Oasis", engine);
        this.log = new Log("Welcome to the Desert", engine);
        this.player = new Player(this.world);
        this.player.addDrawing('wander', Resources.Wanderer.asSprite());
        this.playerFocus = new Actor(0,0,2,2,Color.White);
        this.controller = new GameController(engine);
    }

    onInitialize() {
        this.add(this.grid);
        this.add(this.player);
        this.add(this.playerFocus);
        this.add(this.title);
        this.add(this.subtitle);
        this.add(this.log);
        this.camera.strategy.lockToActor(this.player);
    }

    onActivate() {
        this.ticks = 0;
        this.leaving = false;
        this.camera.zoom(Wander.zoom);
        if (this.world.playerPos[0] !== -1) {
            let [x,y] = this.world.playerPos;
            this.player.pos = new Vector(x,y);
        }
    }

    onPreUpdate() {
        this.ticks++;
        this.world.setPlayerPosition(this.player.pos.x, this.player.pos.y);
        this.grid.forEachVisibleCreature(({ creature }) => this.world.step(creature))
        let input = this.controller.state();
        this.handleFocus(input);

        let vec = new Vector(input.dx, input.dy);
        this.player.move(vec);

        if (input.attack) {
            this.player.currentDrawing.addEffect(new Effects.Colorize(Color.Red.clone().darken(0.5)));
        } else {
            this.player.currentDrawing.clearEffects();
        }

        if (input.zoom && this.ticks > 30 && !this.leaving) {
            this.leaving = true;
            this.engine.goToScene('fly')
        }
    }

    private handleFocus(input: InputState) {
        if (this.player.viewing && this.player.viewingAt) {
            let it: TheniaItem | TheniaCreature = this.player.viewing;
            let focused: Point = this.player.viewingAt
            if (input.query) {
                this.log.setMessage(it.description)
            } else if (input.interact) {
                if (it instanceof TheniaItem) {
                    let result = this.world.interact(it, focused);
                    if (result) {
                        this.log.setMessage(result);
                    }
                } else if (it instanceof TheniaCreature) {
                    if (it.kind === 'horse') {
                        console.log('would ride!')
                        it.state.visible = false
                        this.world.ride(it)
                        this.engine.goToScene('ride')
                    } else {
                        // play a sound?
                        console.warn("Don't know how to interact with creature: " + it.name)
                    }
                } else {
                    console.error("No interaction with: " + it)
                }
            }

            let doFocus = !!focused;
            if (it instanceof TheniaItem && it.state.collected) {
                doFocus = false;

            }
            if (doFocus) { //} && !it.state.collected) {
                // console.log("focus")
                let sz = GridView.cellSize;
                this.playerFocus.pos.x = focused[0] * sz + sz / 2;
                this.playerFocus.pos.y = focused[1] * sz + sz / 2;
                this.playerFocus.visible = true;
                this.playerFocus.color = Color.White
            }
        } else {
            this.playerFocus.visible = false
        }
    }
}
