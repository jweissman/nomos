import { Engine, Label, TextAlign, Color, Sprite, Texture, Actor } from "excalibur";
import GridView from "./Actors/GridView";
import Thenia, { TheniaObject } from "./Models/Thenia";
import { World } from "./Models/World";

export const Resources: { [key: string]: any } = {
    Tree: new Texture("/assets/tree.png"),
}

class Player extends Actor {}

class Game extends Engine {
    world: World<TheniaObject> = new Thenia();

    grid: GridView<TheniaObject>;
    player: Player;
    greeting: Label; 

    constructor(message: string) {
        super();

        this.greeting = this.createMessage(message);
        this.add(this.greeting);

        let tree = new Sprite(Resources.Tree,0,0,64,64);
        this.grid = new GridView(this.world,{
            tree,
        });
        // this.grid.add('tree', [2,3]);
        this.add(this.grid);

        this.player = new Player();
        this.add(this.player)
    }


    private createMessage(message: string) {
        let hello = new Label(message, this.canvasWidth / 2, 100, 'Segoe UI Light');
        hello.color = Color.White;
        hello.fontSize = 50;
        hello.textAlign = TextAlign.Center;
        return hello;
    }
}

export default Game;