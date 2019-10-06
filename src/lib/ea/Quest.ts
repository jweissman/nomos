import Point from "../nomos/Values/Point";
import { Quest, Worldlike, Wonder } from "./World";
import distance from "../util/distance";
import GridView from "../nomos/Actors/GridView";

type Goal = { name: string, location: Point }

export function nextQuestGoal(q: Quest, w: Worldlike): Goal | null {
    let result: Goal | null = null;
    if (q.goal instanceof Wonder) {
        let undiscoveredClues = q.goal.clueLocations.filter(clue => {
            let it = w.map.getItemKindAt(clue)
            return it && !(it.state.collected)
        })
        if (undiscoveredClues.length) {
            result = { name: q.goal.name + ' clue', location: undiscoveredClues[0] }
        } else {
            result = { name: q.goal.name, location: q.goal.location }
        }
    }
    return result
}

export function describeQuest(q: Quest, w: Worldlike): string {
    let description = 'achieve the goal'
    if (q.goal instanceof Wonder) {
        let undiscoveredClues = q.goal.clueLocations.filter(clue => {
            let it = w.map.getItemKindAt(clue)
            return it && !(it.state.collected)
        })
        if (undiscoveredClues.length) {
            description = `investigate clues to ${q.goal.description}`
        } else {
            description = `seek ${q.goal.description}`
        }
    }
    return description
}

interface LocationDiscovered { kind: 'location-discovered', description: string }
const discover = (description: string): LocationDiscovered => {
    return { kind: 'location-discovered', description }
}

type Event = LocationDiscovered

export default class QuestController {
    update(playerPos: Point, world: Worldlike): Event | null {
        let q = world.currentPlayerQuest;
        if (q) {
            let { goal } = q;
            if (goal instanceof Wonder) {
                let sz = GridView.cellSize;
                let [px, py] = playerPos;
                let d = distance([px / sz, py / sz], goal.location)
                if (d < 20) {
                    world.completeQuest(q);
                    return discover("Welcome to " + goal.name);
                }
            }
        }
        return null;
    }
}