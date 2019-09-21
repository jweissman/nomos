import { Engine, Color, Scene, Vector, Actor } from "excalibur";
import GridView from "../Actors/GridView";
import { GameController, InputState } from "../GameController";
import { Player } from "../Actors/Player";
import { WorldView } from "../Models/Thenia";
import { Focus, Header, Subheader, Log } from "../Actors/UI";
import Point from "../Values/Point";
import { TheniaItem } from "../Models/Thenia/TheniaItem";
import { Worldlike, Item, Creature } from "../Models/World";
import { SpriteDict } from "../Values/SpriteDict";
import { TheniaCreature } from "../Models/Thenia/TheniaCreature";

export class Wander extends Scene {
    static zoom: number = 1;
    ticks: number = 0;
    grid: WorldView;
    player: Player<Item, Creature>; //TheniaItem, TheniaCreature>;
    playerFocus: Focus;
    title: Header;
    subtitle: Subheader;
    log: Log;
    controller: GameController;
    leaving: boolean = false;

    constructor(private engine: Engine, private world: Worldlike, private sprites: SpriteDict) {
        super(engine);
        this.grid = new WorldView(this.world, this.sprites);
        this.title = new Header("Nemian Desert", engine);
        this.subtitle = new Subheader("Seek the Oasis", engine);
        this.log = new Log("Welcome to the Desert", engine);
        this.player = new Player(engine, world);
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
        let pos: Point = this.world.getPlayerLocation();
        let [x,y] = pos;
        if (x !== -1) {
            this.player.pos = new Vector(x,y);
        }
    }

    onPreUpdate() {
        this.ticks++;
        this.world.setPlayerLocation([this.player.pos.x, this.player.pos.y]);
        let horseAround = false;
        this.grid.forEachVisibleCreature(({ creature }) => {
            this.world.updateCreature(creature)
            if (creature.kind === 'horse') {
                horseAround = true;
            }
        })
        let input = this.controller.state();
        this.handleFocus(input);

        let vec = new Vector(input.dx, input.dy);
        let factor = 1;
        if (input.query) { factor = 1.3; }
        this.player.move(vec, factor);

        if (input.attack) {
            this.player.attack()
        }

        if (input.whistle) {
            if (!horseAround) {
                let [x,y] = this.world.getPlayerLocation();
                let sz = GridView.cellSize;
                this.world.map.spawnCritter(TheniaCreature.horse(), [x/sz,y/sz])
            }
        }
        
        if (input.zoom && this.ticks > 30 && !this.leaving) {
            this.leaving = true;
            this.engine.goToScene('fly')
        }
    }

    private handleFocus(input: InputState) {
        if (this.player.viewing && this.player.viewingAt) {
            let it: Item | Creature = this.player.viewing;
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
                        if (this.ticks > 80 && !this.leaving) {
                            this.leaving = true;
                            it.state.visible = false
                            this.world.ride(it)
                            this.engine.goToScene('ride')
                        }
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
            if (doFocus) {
                // console.log("FOCUS", it, focused)
                // todo and not collected?
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
