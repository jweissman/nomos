import Point from "../Values/Point";

import { Quest, Worldlike, Wonder } from "./World";

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
            // seek the wonder!
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

