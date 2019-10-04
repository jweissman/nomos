import { Scene } from "excalibur";

export default class Loading extends Scene {
    onActivate() {

    }
    draw() {
        // hmm, we need to load the world's new map
        // but what if it doesn't exist? then we have to gen
        // which could take time, which is a busy wait...
        // load bars
        return
    }
}