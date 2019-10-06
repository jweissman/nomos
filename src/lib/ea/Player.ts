import { Playerlike, Quest } from "./World";
import Point from "../nomos/Values/Point";

export default class Player implements Playerlike {
    location: Point = [-1,-1];
    quests: Quest[] = []
    activeQuest: Quest | null = null
    maxHp: number = 100
    hp: number = 100
}