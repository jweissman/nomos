import { Vector } from "excalibur";
import getRandomFloat from "./getRandomFloat";

export default function getRandomUnitVector() {
  return new Vector(
                getRandomFloat(-1,1),
                getRandomFloat(-1,1),
            ).normalize()
}
