import Point from "../Values/Point";

import { Quest, Worldlike, Wonder, Playerlike } from "./World";

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

export function isQuestComplete(q: Quest, w: Worldlike): boolean {
  if (q.goal instanceof Wonder) {
      // are we at the wonder? then we are done!
  }
  return false;
}

interface LocationDiscovered { kind: 'location-discovered', location: string }

type Event = LocationDiscovered

// todo checkPlayerQuest?
export default class QuestController {
    update(playerPos: Point, world: Worldlike): Event | null {
        // check if quest is completed
        // let q = world.currentPlayerQuest;
        // console.log("CONSIDER IF QUEST IS DONE!", { q })
        // if (isQuestComplete(player.quests[0]))
        // if it is... complete the quest
        // there may be an event!
        return null;
    }
}