import Configuration from "./configuration.js";
import Game from "./game.js";
import AutoPlayer from "./autoplayer.js";
import Display from "./display.js";

let config;
let game;
let autoPlayer;
let display;

// Start the game
window.onload = async function() {
    config = new Configuration();
    game = new Game(config);
    autoPlayer = new AutoPlayer(config, game);
    display = new Display(config, game, autoPlayer);
    display.activateGame();
}
