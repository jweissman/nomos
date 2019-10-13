import { Color, Scene, Vector, Actor } from "excalibur";
import GridView from "../Actors/GridView";
import { GameController, InputState } from "../GameController";
import { PlayerView } from "../Actors/PlayerView";
import { WorldView } from "../Models/Thenia";
import Point from "../Values/Point";
import { TheniaItem } from "../Models/Thenia/TheniaItem";
import { Worldlike, Item, Creature, Enemy, Person } from "../../ea/World";
import { SpriteDict } from "../Values/SpriteDict";
import { TheniaCreature } from "../Models/Thenia/TheniaCreature";
import { Hud } from "../Actors/Hud";
import { SceneController } from "./SceneController";
import { theniaExtent } from "../Models/Thenia/Thenia";
import { TheniaPerson } from "../Models/Thenia/TheniaPerson";
import Game from "../Game";

export class Wander extends Scene {
    static zoom: number = 2.0;
    ticks: number = 0;
    grid: WorldView;
    player: PlayerView<Enemy, Item, Creature>;
    playerFocus: Actor
    controller: GameController;
    leaving: boolean = false;
    hud: Hud;
    manager: SceneController;

    constructor(
        private engine: Game,
        private world: Worldlike,
        private sprites: SpriteDict
    ) {
        super(engine);
        this.player = new PlayerView(engine, world);
        this.player.visible = false;

        let sz = GridView.cellSize;
        let e = theniaExtent
        this.world.setPlayerLocation([e/2*sz,e/2*sz])
        this.player.pos = new Vector(e/2*sz,e/2*sz)
        this.playerFocus = new Actor(0,0,2,2,Color.White);

        this.controller = new GameController(engine);
        this.grid = new WorldView(this.world, this.sprites, this.player);
        this.hud = new Hud(engine, this);

        this.manager = new SceneController(this.engine, this, this.world)
    }

    onInitialize() {
        this.add(this.grid);
        this.add(this.player);
        this.add(this.playerFocus);
        this.hud.setup();
        this.camera.strategy.lockToActor(this.player);
    }

    onActivate() {
        this.engine.backgroundColor = new Color(240,180,160)
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
        this.manager.update();

        let [px,py] = this.world.getPlayerLocation();
        this.player.pos = new Vector(px,py);

        let horseAround = false;
        this.grid.forEachVisibleCreature(({ creature }: { creature: Creature }) => {
            if (creature.kind === 'horse') {
                horseAround = true;
            }
        })
        let input = this.controller.state();
        this.handleFocus(input);

        if (this.player.attacking && this.player.mayAttack) {
            this.player.setDrawing('idle')
            this.player.attacking = false;
        }

        if (this.player.mayAttack && (input.attack || input.heavyAttack)) {
            this.player.attack(input.heavyAttack ? 'melee-heavy' : 'melee-fast')
        }
        let vec = new Vector(input.dx, input.dy);
        let factor = 1;
        if (input.query) { factor = 1.3; }
        this.player.move(vec, factor);

        if (input.whistle) {
            this.camera.zoom(Wander.zoom)
            if (!horseAround) {
                let [x, y] = this.world.getPlayerLocation();
                let sz = GridView.cellSize;
                this.world.map.spawnCritter(TheniaCreature.horse(), [x / sz, y / sz])
            }
        }

        if (input.zoom && this.ticks > 30 && !this.leaving) {
            this.leaving = true;
            this.engine.goToScene('fly')
        } 

        if (input.meditate && !this.leaving && this.ticks > 35) {
            this.leaving = true;
            this.camera.zoom(20, 1250).then(() => this.engine.goToScene('meditate'))
        }
    }

    private handleFocus(input: InputState) {
        if (this.player.viewing && this.player.viewingAt) {
            let it: Enemy | Item | Creature | Person = this.player.viewing;
            let focused: Point = this.player.viewingAt
            if (input.query) {
                this.hud.log.setMessage([`You see a ${it.description}.`])
            } else if (input.interact) {
                if (it instanceof TheniaItem) {
                    let result = this.world.interact(it, focused);
                    if (result) {
                        this.hud.log.setMessage(result);
                    }
                } else if (it instanceof TheniaCreature) {
                    if (it.kind === 'horse') {
                        if (this.ticks > 80 && !this.leaving) {
                            this.leaving = true;
                            it.state.visible = false
                            this.world.ride(it)
                            this.engine.goToScene('ride')
                        }
                    } else if (it.kind === 'sheep') {
                        it.tame();
                    }
                } else if (it instanceof TheniaPerson) {
                    let person:TheniaPerson = it;
                    this.engine.startDialogue(person, person.says, [ this.sprites.cactus, this.sprites.bigCactus, this.sprites.rock ])
                    this.engine.lastScene=('wander')
                    this.engine.goToScene('talk')
                }
            }

            let doFocus = !!focused;
            if (it instanceof TheniaItem && it.state.collected) {
                doFocus = false;

            }
            if (doFocus) {
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
