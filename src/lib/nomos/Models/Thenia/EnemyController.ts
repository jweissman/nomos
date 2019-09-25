import GridView from "../../Actors/GridView";
import { TheniaEnemy, Activity } from "./TheniaEnemy";
import distance from "../../../util/distance";
import { Vector } from "excalibur";
import { Thenia } from "./Thenia";
import Point from "../../Values/Point";
export class EnemyController {
    constructor(private world: Thenia) { }
    update(enemy: TheniaEnemy) {
        if (enemy.dead) {
            return;
        }
        let sz = GridView.cellSize;
        let pos = this.world.map.getEnemyPosition(enemy);
        let [px, py] = this.world.getPlayerLocation();
        let d = distance([px/sz - 0.5, py/sz - 0.5], pos);
        let dy = pos[1] - py/sz-0.5
        if (d < 7 && d > 0.9) {
            enemy.alert([px-sz/2, py-sz/2]);
        } else if (d <= 1 && dy < 60) {
            enemy.attack()
        }
            // enemy.engage()
            // enemy.walk([px - sz / 2, py - sz / 2]);
        let activity: Activity = 'idle';
        if (enemy.state.gotHit) {
            activity = 'guard';
        } else if (enemy.state.walkingTo) {
            activity = enemy.state.alert ? 'alert-walk' : 'walk';
            
            let distanceToTarget = this.tracksTarget(enemy, enemy.state.walkingTo);
            if (distanceToTarget < 32) {
                enemy.stopWalking()
                activity = 'idle'
            }
        } else if (enemy.state.attacking) {
            activity = 'attack'
        }
        enemy.state.activity = activity
    }

    private tracksTarget(enemy: TheniaEnemy, target: Point) {
        let sz = GridView.cellSize;
        let [tx, ty] = target;
        let pos = this.world.map.getEnemyPosition(enemy);
        let [x, y] = pos;
        let enemyLocation = new Vector(x * sz, y * sz);
        let targetLocation = new Vector(tx, ty);
        let d = distance([x * sz, y * sz], [tx, ty]);
        let v = targetLocation.sub(enemyLocation);
        v = v.normalize() //.scale(enemy.speed);
        enemy.state.facing = enemyLocation.sub(targetLocation);
        let newLoc = new Vector(...pos).add(v.scale(enemy.speed));
        this.world.map.setEnemyPosition(enemy, [newLoc.x, newLoc.y]);
        return d;
    }
}
