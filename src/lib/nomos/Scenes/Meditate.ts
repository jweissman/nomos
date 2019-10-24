import { Scene, Color, Vector, Actor } from "excalibur";
import TheniaEngine, { WorldView } from "../Models/Thenia";
import assembleSprites from "../Sprites";
import { PlayerView } from "../Actors/PlayerView";
import { TheniaEnemy } from "../Models/Thenia/TheniaEnemy";
import { TheniaItem } from "../Models/Thenia/TheniaItem";
import { TheniaCreature } from "../Models/Thenia/TheniaCreature";
import { TheniaDoodad } from "../Models/Thenia/TheniaDoodad";
import { TheniaTerrain } from "../Models/Thenia/TheniaTerrain";
import getRandomInt from "../../util/getRandomInt";
import { SceneController } from "./SceneController";
import { GameController, InputState } from "../GameController";
import { Hud } from "../Actors/Hud";
import GridView from "../Actors/GridView";
import Point from "../Values/Point";
import { TheniaPerson } from "../Models/Thenia/TheniaPerson";
import { Enemy, Item, Creature, Person } from "../../ea/World";
import Game from "../Game";
import { SpriteDict } from "../Values/SpriteDict";
import { conversation, topic, q } from "../../ea/Dialogue";

let e = 64;
export class Meditate extends Scene {
    startedMeditatingAt: number = -1;
    wakingUp: boolean = false
    zoom: number = 3.0
    walkSpeed: number = 0.6
    world: TheniaEngine;
    grid: WorldView;
    player: PlayerView<TheniaEnemy, TheniaItem, TheniaCreature>;
    manager: SceneController;
    controller: GameController;
    hud: Hud;
    playerFocus: Actor

    constructor(private engine: Game, private sprites: SpriteDict) {
        super(engine);
        this.world = new TheniaEngine([e,e]);
        this.player = new PlayerView(this.engine, this.world)
        this.player.visible = false
        let sz = GridView.cellSize;
        this.world.setPlayerLocation([e/2*sz,e/2*sz])
        this.player.pos = new Vector(e/2*sz,e/2*sz)

        this.grid = new WorldView(this.world, assembleSprites(this.engine), this.player);
        this.manager = new SceneController(this.engine, this, this.world)
        this.controller = new GameController(engine);
        this.hud = new Hud(this.engine, this);

        this.playerFocus = new Actor(0,0,2,2,Color.White);
        this.playerFocus.opacity = 0.2
    }

    genDreamWorld() {
        let form = TheniaTerrain.forms();
        let grid = TheniaTerrain.fineGrid();
        let grid2 = TheniaTerrain.roughGrid();
        let star = TheniaTerrain.stars();
        let crystal = TheniaDoodad.crystal()
        for (let i = 0; i < Math.pow(e/7,2); i++) {
            let [x,y] = [getRandomInt(0,e),getRandomInt(0,e)]
            this.world.map.setTerrain(form, [x,y])
        }
        for (let i = 0; i < Math.pow(e/4,2); i++) {
            let [x,y] = [getRandomInt(0,e),getRandomInt(0,e)]
            this.world.map.setTerrain(grid, [x,y])
        }
        for (let i = 0; i < Math.pow(e / 3, 2); i++) {
            let [x,y] = [getRandomInt(0,e),getRandomInt(0,e)]
            this.world.map.setTerrain(grid2, [x,y])
        }
        for (let i = 0; i < Math.pow(e / 2, 2); i++) {
            let [x,y] = [getRandomInt(0,e),getRandomInt(0,e)]
            this.world.map.setTerrain(star, [x,y])
        }
        for (let i = 0; i < Math.pow(e/10,2); i++) {
            let [x,y] = [getRandomInt(0,e),getRandomInt(0,e)]
            this.world.map.putDoodad(crystal, [x,y])
        }

        let wiseMan = TheniaPerson.wiseMan(
            conversation(
                'Spectral Old Man',
                [
                    topic('Nullspace', [
                        q('What is this place?', [
                            'It is the world of your mind,',
                            'a place for rest, contemplation and discovery.'
                        ], [
                            "Why don't you explore for a bit?"
                        ])
                    ]),
                    topic('Yourself', [
                        q('What are you?', ['Just another figment of your dream matrix...']),
                        q('Why are you here?', ["You brought me here. Maybe I can help?"]),
                    ])
                ]
            )
        );
        let middle: Point = [this.world.dimensions[0]/2,this.world.dimensions[1]/2];
        this.world.map.spawnPerson(wiseMan, middle);

        let [mx,my] = middle;
        let pillar = TheniaDoodad.pillar();
        this.world.map.putDoodad(pillar, [mx+2,my+3])
        this.world.map.putDoodad(pillar, [mx-6,my-3])
        this.world.map.putDoodad(crystal, [mx-4,my-1])
    }

    onInitialize() {
        this.genDreamWorld()
        this.add(this.grid)
        this.add(this.player)
        this.add(this.playerFocus)
        this.camera.strategy.lockToActor(this.player);
    }

    onActivate() {
        this.engine.backgroundColor = new Color(20,40,60)
        this.wakingUp = false;
        this.camera.zoom(this.zoom);
        this.startedMeditatingAt = new Date().getTime();
        let pos: Point = this.world.getPlayerLocation();
        let [x,y] = pos;
        if (x !== -1) {
            this.player.pos = new Vector(x,y);
        }
    }

    onPreUpdate() {
        this.world.setPlayerLocation([this.player.pos.x, this.player.pos.y]);
        this.manager.update();
        let [px,py] = this.world.getPlayerLocation();
        this.player.pos = new Vector(px,py);
        let input = this.controller.state();
        let vec = new Vector(input.dx, input.dy);
        this.player.move(vec, this.walkSpeed);
        let now = new Date().getTime();
        if ((input.zoom || input.meditate) && now - this.startedMeditatingAt > 1500 && !this.wakingUp) {
            this.wakingUp = true;
            this.camera.zoom(0.2,500).then(() => this.engine.goToScene('wander'))
        }

        this.handleFocus(input);
    }

    private handleFocus(input: InputState) {
        if (this.player.viewing && this.player.viewingAt) {
            let it: Enemy | Item | Creature | Person = this.player.viewing;
            let focused: Point = this.player.viewingAt
            if (input.query) {
                this.hud.log.setMessage([it.description])
            } else if (input.interact) {
                if (it instanceof TheniaItem) {
                    let result = this.world.interact(it, focused);
                    if (result) {
                        this.hud.log.setMessage(result);
                    }
                // } else if (it instanceof TheniaCreature) {
                //     if (it.kind === 'horse') {
                //         if (this.ticks > 80 && !this.leaving) {
                //             this.leaving = true;
                //             it.state.visible = false
                //             this.world.ride(it)
                //             this.engine.goToScene('ride')
                //         }
                //     } else if (it.kind === 'sheep') {
                //         it.tame();
                //     }
                } else if (it instanceof TheniaPerson) {
                    let person: TheniaPerson = it;
                    // console.log("START DIALOG", person, person.says)
                    this.engine.startDialogue(person, person.says, [ this.sprites.stars, this.sprites.forms, this.sprites.pillar ])
                    this.engine.lastScene = 'meditate'
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