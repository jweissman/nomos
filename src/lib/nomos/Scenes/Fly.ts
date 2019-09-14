import { Scene, Engine, Sprite, Actor, Vector, EasingFunctions } from "excalibur";
import Thenia, { TheniaItem, TheniaDoodad, TheniaTerrain } from "../Models/Thenia";
import GridView from "../Actors/GridView";
import { Resources, SpriteSheets } from "../Resources";
import { GameController } from "../GameController";
import { Player } from "../Actors/Player";

export default class Fly extends Scene {
    controller: GameController;
    grid: GridView<TheniaItem, TheniaDoodad, TheniaTerrain>;
    bird: Actor;
    player: Player<TheniaItem>;
    leaving: boolean = false;
    ticks: number = 0;

    constructor(private engine: Engine, private world: Thenia, private sprites: {
        [key: string]: Sprite;
    }) {
        super(engine);
        this.grid = new GridView<TheniaItem, TheniaDoodad, TheniaTerrain>(this.world, this.sprites);
        this.bird = new Actor();
        let birdFlying = SpriteSheets.BirdFlying.getAnimationForAll(engine, 800);
        birdFlying.scale = new Vector(5,5)
        this.bird.addDrawing('flying', birdFlying)
        this.controller = new GameController(engine);
        this.player = new Player(this.world);
        this.player.addDrawing(Resources.Wanderer)
    }

    onInitialize() {
        this.add(this.grid);
        this.add(this.bird);
        this.add(this.player)
        this.camera.strategy.lockToActor(this.bird);
    }

    onActivate() { 
        let [x, y] = this.world.playerPos
        this.player.pos = new Vector(x,y)
        this.bird.pos = new Vector(x,y)
        this.bird.opacity = 0.2
        this.camera.zoom(0.5, 1000).
            then(() => this.bird.opacity = 1.0);
        this.ticks = 0;
        this.leaving = false;
    }

    lastVec = new Vector(1,1);
    onPreUpdate() {
        this.ticks++;
        let input = this.controller.state();
        let vec = new Vector(input.dx, input.dy);
        let mod = 6.8;
        if (vec.magnitude() > 0.2)  {
            this.lastVec = vec.normalize();
            if (input.query) { mod += 9.4; } //vec.scaleEqual(2) }
            this.bird.pos.addEqual(this.lastVec.scale(mod));
            // this.bird.vel.addEqual(vec);
        } else {
            this.bird.pos.addEqual(this.lastVec.scale(mod));
        }
        this.bird.rotation = this.lastVec.toAngle() + Math.PI / 2

        if (input.zoom && !this.leaving && this.ticks > 100) {
            this.leaving = true
            this.bird.opacity = 0.2
            this.camera.zoom(2.0, 2000, EasingFunctions.EaseInOutQuad)
            this.camera.move(this.player.pos, 1400, EasingFunctions.EaseInOutCubic).then(() =>
            this.engine.goToScene('wander'));
            
        }
    }

}