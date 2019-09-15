import { Engine, Color, Sprite, Scene, Vector, Actor, Effects } from "excalibur";
import GridView from "../Actors/GridView";
import { GameController } from "../GameController";
import { Player } from "../Actors/Player";
import Thenia, { TheniaView } from "../Models/Thenia";
import { Focus, Header, Subheader, Log } from "../Actors/UI";
import Point from "../Values/Point";
import { Resources } from "../Resources";
import { TheniaItem } from "../Models/Thenia/TheniaItem";

export class Wander extends Scene {
    static zoom: number = 1
    ticks: number = 0;
    grid: TheniaView;
    player: Player<TheniaItem>;
    playerFocus: Focus;
    enemy: Actor;
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
        this.title = new Header("Nemian Desert", engine)
        this.subtitle = new Subheader("Seek the Oasis", engine)
        this.log = new Log("Welcome to the Desert", engine);
        this.player = new Player(this.world);
        this.player.addDrawing('wander', Resources.Wanderer.asSprite())
        this.playerFocus = new Actor(0,0,2,2,Color.White);
        this.enemy = new Actor(0,0);
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
        this.camera.zoom(Wander.zoom)
    }

    onPreUpdate() {
        this.ticks++;
        // if (this.ticks%13===0) {
            this.grid.forEachVisibleCreature(({creature}) => {
            // for (let i=0;i<this.world.listCreatures().length;i++) {
                for (let t=0;t<500;t++) {
                    let i = this.world.listCreatures().indexOf(creature);
                this.world.moveCritter(
                    i
                    // 1 + Math.floor(Math.random() * (this.world.listCreatures().length - 1))
                );
                }
            })
        // }
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
            if (focused && !it.state.collected) {
                let sz = GridView.cellSize;
                this.playerFocus.pos.x = focused[0] * sz + sz / 2;
                this.playerFocus.pos.y = focused[1] * sz + sz / 2;
                this.playerFocus.visible = true;
                this.playerFocus.color = Color.White
            }
        } else {
            this.playerFocus.visible = false
        }

        this.world.setPlayerPosition(this.player.pos.x, this.player.pos.y);

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
}
