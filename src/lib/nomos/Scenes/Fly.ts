import { Scene, Actor, Vector, EasingFunctions } from "excalibur";
import { Resources, SpriteSheets } from "../Resources";
import { GameController } from "../GameController";
import { PlayerView } from "../Actors/PlayerView";
import { TheniaItem } from "../Models/Thenia/TheniaItem";
import TheniaEngine, { TheniaView } from "../Models/Thenia";
import { Wander } from "./Wander";
import { TheniaCreature } from "../Models/Thenia/TheniaCreature";
import { SpriteDict } from "../Values/SpriteDict";
import { TheniaEnemy } from "../Models/Thenia/TheniaEnemy";
import { Hud } from "../Actors/Hud";
import { SceneController } from "./SceneController";
import Point from "../Values/Point";
import Game from "../Game";

export default class Fly extends Scene {
    static zoom: number = 0.35
    controller: GameController;
    grid: TheniaView;
    bird: Actor;
    player: PlayerView<TheniaEnemy, TheniaItem, TheniaCreature>;
    leaving: boolean = false;
    ticks: number = 0;
    hud: Hud
    manager: SceneController;

    constructor(private engine: Game, private world: TheniaEngine, private sprites: SpriteDict) {
        super(engine);
        this.bird = new Actor();
        let birdScale = new Vector(4,4)
        let birdFlying = SpriteSheets.BirdFlying.getAnimationBetween(engine, 0, 2, 200)
        birdFlying.scale = birdScale
        let birdIdle = SpriteSheets.BirdFlying.getSprite(2)
        birdIdle.scale = birdScale
        this.bird.addDrawing('pump', birdFlying)
        this.bird.addDrawing('idle', birdIdle)
        this.bird.setDrawing('idle')
        this.controller = new GameController(engine);
        this.player = new PlayerView(engine, this.world);
        this.player.addDrawing(Resources.Wanderer)
        this.grid = new TheniaView(this.world, this.sprites, this.player);
        this.hud = new Hud(engine, this)
        this.manager = new SceneController(this.engine, this, this.world)
    }

    onInitialize() {
        this.add(this.grid);
        this.add(this.player)
        this.add(this.bird);
        this.hud.setup()
    }

    onActivate() { 
        let [x, y] = this.world.getPlayerLocation();
        this.player.pos = new Vector(x,y);
        this.bird.pos = new Vector(x,y);
        this.bird.opacity = 0.2;
        this.ticks = 0;
        this.leaving = false;
        this.camera.zoom(Fly.zoom, 200).then(() => this.bird.opacity = 1.0);
        this.camera.strategy.lockToActor(this.bird);
    }

    onDeactivate() {
        this.bird.opacity = 0.2;
    }

    lastVec = new Vector(1,1);
    onPreUpdate() {
        this.ticks++;
        let loc: Point = [this.bird.pos.x,this.bird.pos.y]
        this.manager.update(loc);
        this.hud.clearPointers()
        let input = this.controller.state();
        let vec = new Vector(input.dx, input.dy);
        let mod = 4.8;
        if (input.query) {
            mod += 2.4;
            this.bird.setDrawing('pump')
        } else {
            this.bird.setDrawing('idle')
        }
        if (vec.magnitude() > 0.2) {
            this.lastVec = vec.normalize();
            this.bird.pos.addEqual(this.lastVec.scale(mod));
        } else {
            this.bird.pos.addEqual(this.lastVec.scale(mod));
        }
        this.bird.rotation = this.lastVec.toAngle() + Math.PI / 2
        if (input.zoom && !this.leaving && this.ticks > 100) {
            this.leaving = true
            this.bird.opacity = 0.2
            this.camera.move(this.player.pos, 500, EasingFunctions.EaseInOutCubic);
            this.camera.zoom(Wander.zoom, 400).then(() =>
                this.engine.goToScene('wander')
            );
        }
    }
}