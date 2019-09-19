import { Scene, Engine, Actor, Vector } from "excalibur"
import Thenia, { TheniaView } from "../Models/Thenia";
import { SpriteSheets } from "../Resources";
import { GameController } from "../GameController";
import { Wander } from "./Wander";
import { SpriteDict } from "../Values/SpriteDict";

export class Ride extends Scene {
    static zoom: number = 0.75
    static speed: number = 6.5
    controller: GameController
    ticks: number = 0
    grid: TheniaView
    horse: Actor

    constructor(private engine: Engine, private world: Thenia, private sprites: SpriteDict) {
        super(engine);
        this.grid = new TheniaView(this.world, this.sprites);
        this.controller = new GameController(engine);
        this.horse = new Actor()
        let horseRiding = SpriteSheets.HorseRiding.getSprite(1);
        this.horse.addDrawing(horseRiding)
    }

    onInitialize() {
        this.add(this.grid);
        this.add(this.horse);
    }

    onActivate() { 
        this.ticks = 0;
        this.leaving = false;
        let [x, y] = this.world.playerPos
        this.horse.pos = new Vector(x,y)
        this.camera.zoom(Ride.zoom, 200)
        this.camera.strategy.lockToActor(this.horse);
    }
 
    lastVec = new Vector(1,1)
    leaving = false
    onPreUpdate() {
        this.ticks++;

        this.world.setPlayerLocation([this.horse.pos.x, this.horse.pos.y]);
        this.grid.forEachVisibleCreature(({ creature }) => this.world.updateCreature(creature))

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
        if (!this.world.isBlocked([next.x, next.y])) {
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