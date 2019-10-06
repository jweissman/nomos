import { Scene, Engine, Color, Vector } from "excalibur";
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
import { GameController } from "../GameController";
import { Hud } from "../Actors/Hud";
import GridView from "../Actors/GridView";
import Point from "../Values/Point";

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
    constructor(private engine: Engine) {
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
    }

    onInitialize() {
        this.genDreamWorld()
        this.add(this.grid)
        this.add(this.player)
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
    }
}