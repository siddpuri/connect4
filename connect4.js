import Game from "./game.js";
import AutoPlayer from "./autoplayer.js";
import Display from "./display.js";

// Start the game
window.onload = function() {
    let game = new Game();
    let autoPlayer = new AutoPlayer(game);
    let display = new Display(game, autoPlayer);
    display.activateGame();
}
