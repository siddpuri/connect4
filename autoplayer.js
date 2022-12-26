// Game constants
const depth = 8;

function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// AutoPlayer class
export default class AutoPlayer {
    constructor(game) {
        this.game = game;
    }

    getMove() {
        let bestMoves = [];
        let bestValue = -Infinity;
        for (let col = 0; col < this.game.numCols; col++) {
            const move = this.game.getMove(col);
            if (move) {
                const oldBoardValue = this.game.makeMove(move);
                const value = -this.minMax(depth - 1);
                if (value > bestValue) {
                    bestValue = value;
                    bestMoves = [move];
                } else if (value == bestValue) {
                    bestMoves.push(move);
                }
                this.game.revertMove(move, oldBoardValue);
            }
        }
        return randomElement(bestMoves);
    }

    minMax(depth) {
        if (depth == 0 || this.game.hasWon) {
            return this.game.effectiveValue;
        }
        let bestValue = -Infinity;
        for (let col = 0; col < this.game.numCols; col++) {
            const move = this.game.getMove(col);
            if (move) {
                const oldBoardValue = this.game.makeMove(move);
                bestValue = Math.max(bestValue, -this.minMax(depth - 1));
                this.game.revertMove(move, oldBoardValue);
            }
        }
        return bestValue;
    }
}