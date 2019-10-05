import GridView from "../../Actors/GridView";
import { TheniaEnemy, Activity } from "./TheniaEnemy";
import distance from "../../../util/distance";
import { Vector } from "excalibur";
import { Thenia } from "./Thenia";
import Point from "../../Values/Point";
export class EnemyController {
    constructor(private world: Thenia) { }
    update(enemy: TheniaEnemy) {
        if (enemy.dead) { return; }
        let sz = GridView.cellSize;
        let pos = this.world.map.getEnemyPosition(enemy);
        let [px, py] = this.world.getPlayerLocation();
        let d = distance([px / sz - 0.5, py / sz - 0.5], pos);
        let dy = pos[1] - py / sz - 0.5
        if (enemy.state.alert) {
            if (d <= 1 && dy < 60) {
                enemy.attack()
            }
            if (d > 1) {
                this.alert(enemy);
            }
        } else {
            if (d < 5) {
                this.alert(enemy);
            }
        }

        let activity: Activity = 'idle';
        if (enemy.state.gotHit) {
            activity = 'guard';
            this.knockback(enemy);
            
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

    private alert(enemy: TheniaEnemy) {
        let sz = GridView.cellSize;
        let [px, py] = this.world.getPlayerLocation();
        enemy.alert([px - sz / 2, py - sz / 2]);
    }

    private knockback(enemy: TheniaEnemy){
        let now = new Date().getTime();
        let lastHit = now - enemy.lastGotHitAt;
        if (lastHit > 350) {
            enemy.state.gotHit = false;
            this.alert(enemy);
        }
        if (lastHit < 220) {
            let [x, y] = this.world.map.getEnemyPosition(enemy);
            let vec = enemy.state.facing
            let newPos = new Vector(x, y).add(vec.normalize().scale(0.08));
            this.world.map.setEnemyPosition(enemy, [newPos.x, newPos.y]);
        }
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
        v = v.normalize();
        enemy.state.facing = enemyLocation.sub(targetLocation);
        let newLoc = new Vector(...pos).add(v.scale(enemy.speed));
        this.world.map.setEnemyPosition(enemy, [newLoc.x, newLoc.y]);
        return d;
    }
}
