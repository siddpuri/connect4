// This code was taken out of display.js and put here for safekeeping. It won't work as it is.

// Tournament class
export default class Tournament {
    constructor(configuration) {
        this.config = configuration;
    }

    async playMultipleTournaments() {
        let results = [];
        for (let i = 1; i <= 8; i++) {
            console.log("Baseline: " + i);
            this.config.configurations[0].depth = i;
            const result = await this.playTournaments();
            results.push(result);
            console.log(result);
        }
        console.log(results);
    }

    async playTournaments() {
        let results = [];
        for (let i = 1; i <= 8; i++) {
            this.config.configurations[1].depth = i;
            const score = await this.playTournament();
            results.push(score[0] - score[1]);
            this.displayResults(results);
        }
        return results;
    }

    async playTournament() {
        this.isThinking = true;
        let scores = [0, 0, 0];
        for (let i = 0; i < tournamentIterations; i++) {
            this.game.resetGameState();
            this.render();
            for (let j = 0; !this.game.isGameOver; j++) {
                this.config.setConfiguration((i + j) % 2);
                this.game.updateConfiguration();
                let move = this.autoPlayer.getMove();
                this.makeMove(move);
                await new Promise(r => setTimeout(r, 10));
            }
            const winner = this.game.winner;
            if (winner == 0) {
                scores[2]++;
            } else {
                scores[(winner - 1 + i) % 2]++;
            }
            this.displayCurrentScore(scores);
        }
        this.game.resetGameState();
        this.render();
        this.isThinking = false;
        return scores;
    }

    displayCurrentScore(scores) {
        let text = "Baseline: "+ scores[0] +", treatment: "+ scores[1] +", ties: "+ scores[2];
        document.getElementById("currentScore").textContent = text;
    }

    displayResults(results) {
        let text = "";
        for (let i = results.length - 1; i >= 0; i--) {
            text += "<p>" + (i + 1) +": "+ results[i] +"</p>";
        }
        document.getElementById("results").innerHTML = text;
    }
 }