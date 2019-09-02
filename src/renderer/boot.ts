import Game, { Resources } from '../lib/nomos/Game';
import { Loader } from 'excalibur';
let game = new Game("Hello there, Nomos!");
let loader = new Loader()
for (var loadable in Resources) {
  if (Resources.hasOwnProperty(loadable)) {
    loader.addResource(Resources[loadable]);
  }
}
loader.suppressPlayButton = true;
game.start(loader).then(function() {
  console.log("Hello there... What's this!");
});