import { Scene, Actor, Vector } from "excalibur"
import TheniaEngine, { TheniaView } from "../Models/Thenia";
import { SpriteSheets } from "../Resources";
import { GameController } from "../GameController";
import { Wander } from "./Wander";
import { SpriteDict } from "../Values/SpriteDict";
import GridView from "../Actors/GridView";
import Point from "../Values/Point";
import { Hud } from "../Actors/Hud";
import { SceneController } from "./SceneController";
import Game from "../Game";

export class Ride extends Scene {
    static zoom: number = 1
    static speed: number = 4.5
    controller: GameController
    ticks: number = 0
    grid: TheniaView
    horse: Actor
    hud: Hud
    manager: SceneController;

    constructor(private engine: Game, private world: TheniaEngine, private sprites: SpriteDict) {
        super(engine);
        this.controller = new GameController(engine);
        this.horse = new Actor();
        let horseRiding = SpriteSheets.HorseRiding.getSprite(1);
        this.horse.addDrawing(horseRiding);
        this.grid = new TheniaView(this.world, this.sprites, this.horse);
        this.hud = new Hud(engine, this)
        this.manager = new SceneController(this.engine, this, this.world)
    }

    onInitialize() {
        this.add(this.grid);
        this.add(this.horse);
        this.hud.setup();
        this.horse.visible = false;
    }

    onActivate() { 
        this.ticks = 0;
        this.leaving = false;
        let [x, y] = this.world.getPlayerLocation();
        this.horse.pos = new Vector(x,y);
        this.camera.zoom(Ride.zoom, 200);
        this.camera.strategy.lockToActor(this.horse);
    }
 
    lastVec = new Vector(1,1)
    leaving = false
    onPreUpdate() {
        this.ticks++;
        let horsePos: Point = ([this.horse.pos.x, this.horse.pos.y]);
        this.world.setPlayerLocation(horsePos);
        this.manager.update()
        let [px,py] = this.world.getPlayerLocation()
        this.horse.pos = new Vector(px,py)

        let input = this.controller.state();
        let vec = new Vector(input.dx, input.dy);
        let mod = Ride.speed;
        if (input.query) {
            mod += 3.4;
        }

        let next: Vector = this.horse.pos;
         if (vec.magnitude() > 0.2) {
            this.lastVec = vec.normalize();
        }
        next = this.horse.pos.add(this.lastVec.scale(mod));
        let sz = GridView.cellSize;
        let nextPt: Point = [next.x / sz, next.y / sz];
        if (!this.world.map.isBlocked(nextPt)) {
            this.horse.pos = next
        }
        this.horse.rotation = this.lastVec.toAngle() + Math.PI / 2
 
        if (input.interact && !this.leaving && this.ticks > 120) {
            this.leaving = true
            this.camera.zoom(Wander.zoom, 400).then(() => {
                this.world.dismount();
                this.engine.goToScene('wander')
            });
        }
    }
}