import { Engine} from "excalibur";
import { Worldlike } from "../Models/World";
import { Wander } from "./Wander";
import { Ride } from "./Ride";
import Fly from "./Fly";
import Point from "../Values/Point";
import { nextQuestGoal, describeQuest } from "../Models/Quest";

export class SceneController {
    constructor(_engine: Engine, private scene: Wander | Ride | Fly, private world: Worldlike) {
    }

    lastGoalName: string = ''
    beforeUpdate(player: Point = this.world.getPlayerLocation()) {
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
        }
    }
}