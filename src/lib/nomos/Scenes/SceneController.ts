import { Engine} from "excalibur";
import { Worldlike } from "../../ea/World";
import { Wander } from "./Wander";
import { Ride } from "./Ride";
import Fly from "./Fly";
import Point from "../Values/Point";
import QuestController, { nextQuestGoal, describeQuest } from "../../ea/Quest";
import { WorldView } from "../Models/Thenia";
import { dereference } from "../../ea/MapLayer";
import GridView from "../Actors/GridView";
import { Meditate } from "./Meditate";

export class SceneController {
    questController: QuestController = new QuestController();

    constructor(
        _engine: Engine,
        private scene: Wander | Ride | Fly | Meditate,
        private world: Worldlike,
    ) {
    }

    lastGoalName: string = ''
    update(playerPos: Point = this.world.getPlayerLocation()) {
        let [w,h] = this.world.map.dimensions;
        let sz = GridView.cellSize;
        this.world.setPlayerLocation(
            dereference(
                this.world.getPlayerLocation(),
                [w*sz,h*sz]
            )
        )

        this.updatePlayer()
        this.updateCreatures()
        this.updateEnemies()
        this.showCurrentQuests(playerPos);
    }

    private get grid(): WorldView { return this.scene.grid }

    private updatePlayer(playerPos: Point = this.world.getPlayerLocation()) { 
        let questController = new QuestController();
        let event = questController.update(playerPos, this.world);
        if (event) {
            this.scene.hud.log.setMessage([event.description])
        }
    }
    
    private updateCreatures() {
        this.grid.forEachVisibleCreature(({ creature }) => {
            this.world.updateCreature(creature)
        })
    }

    private updateEnemies() {
        this.grid.forEachVisibleEnemy(({ enemy }) => {
            this.world.updateEnemy(enemy)
        })
    }

    private showCurrentQuests(player: Point) {
        let q = this.world.currentPlayerQuest;
        if (q) {
            let goal = nextQuestGoal(q, this.world);
            if (goal) {
                this.scene.hud.subtitle.setMessage(describeQuest(q, this.world));
                if (this.lastGoalName != goal.name) {
                    this.scene.hud.clearPointer(this.lastGoalName);
                    this.lastGoalName = goal.name
                }
                this.scene.hud.pointTo(goal.name, goal.location, player, this.scene.grid.frame)
            }
        } else {
            this.scene.hud.clearPointers()
            this.scene.hud.subtitle.setMessage('Explore the desert')
        }
    }
}