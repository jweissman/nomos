import GridView from "../nomos/Actors/GridView";
import Point from "../nomos/Values/Point";
import distance from "../util/distance";
import { Quest } from "./Values";
import { Wonder } from "./Wonder";
import { Worldlike } from "./World";

interface Goal { name: string; location: Point; }

export function nextQuestGoal(q: Quest, w: Worldlike): Goal | null {
    let result: Goal | null = null;
    if (q.goal instanceof Wonder) {
        const undiscoveredClues = q.goal.clueLocations.filter((clue) => {
            const it = w.map.getItemKindAt(clue);
            return it && !(it.state.collected);
        });
        if (undiscoveredClues.length) {
            result = { name: q.goal.name + " clue", location: undiscoveredClues[0] };
        } else {
            result = { name: q.goal.name, location: q.goal.location };
        }
    }
    return result;
}

export function describeQuest(q: Quest, w: Worldlike): string {
    let description = "achieve the goal";
    if (q.goal instanceof Wonder) {
        const undiscoveredClues = q.goal.clueLocations.filter((clue) => {
            const it = w.map.getItemKindAt(clue);
            return it && !(it.state.collected);
        });
        if (undiscoveredClues.length) {
            description = `investigate clues to ${q.goal.description}`;
        } else {
            description = `seek ${q.goal.description}`;
        }
    }
    return description;
}

interface LocationDiscovered { kind: "location-discovered", description: string; }
const discover = (description: string): LocationDiscovered => {
    return { kind: "location-discovered", description };
};

type Event = LocationDiscovered;

export default class QuestController {
    public update(playerPos: Point, world: Worldlike): Event | null {
        const q = world.currentPlayerQuest;
        if (q) {
            const { goal } = q;
            if (goal instanceof Wonder) {
                const sz = GridView.cellSize;
                const [px, py] = playerPos;
                const d = distance([px / sz, py / sz], goal.location);
                if (d < 20) {
                    world.completeQuest(q);
                    return discover("Welcome to " + goal.name);
                }
            }
        }
        return null;
    }
}
