// Game constants
const numRows = 6;
const numCols = 7;

function makeArray(size, f) {
    return Array.from({ length: size }, f);
}

// Game class
export default class Game {
    constructor(config) {
        this.config = config;
        this.weights = [0, 1, config.weight2, config.weight3, Infinity];
        this.initializeQuads();
        this.resetGameState();
    }

    get numCols() { return numCols; }
    get numRows() { return numRows; }
    get isGameOver() { return this.isFull || Math.abs(this.boardValue) == Infinity; }
    get winner() { return this.boardValue == Infinity? 1 : this.boardValue == -Infinity? 2 : 0; }

    get effectiveValue() {
        let result = this.boardValue + this.config.randomness;
        return this.currentPlayer == 1? result : -result;
    }
    
    getChip(row, col) {
        return this.board[row][col];
    }

    initializeQuads() {
        this.numQuads = 0;
        this.gridToQuads = makeArray(numRows, () => makeArray(numCols, () => []));
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                this.addQuad(row, col, 0, 1); // Horizontal quad
                this.addQuad(row, col, 1, 0); // Vertical quad
                this.addQuad(row, col, 1, 1); // Diagonal down and to the right
                this.addQuad(row, col, 1, -1); // Diagonal down and to the left
            }
        }
    }
    
    addQuad(row, col, dRow, dCol) {
        // Don't add anything if part of this quad falls out of bounds.
        if (row + 3 * dRow >= numRows || col + 3 * dCol < 0 || col + 3 * dCol >= numCols) {
            return;
        }
        let quadNumber = this.numQuads++;
        for (let i = 0; i < 4; i++) {
            this.gridToQuads[row + i * dRow][col + i * dCol].push(quadNumber);
        }
    }

    resetGameState() {
        this.board = makeArray(numRows, () => makeArray(numCols, () => 0));
        this.quads = makeArray(this.numQuads, () => [0, 0, 0]);
        this.boardValue = 0;
        this.currentPlayer = 1;
        this.isFull = false;
    }

    getMove(col) {
        if (col < 0 || col >= numCols) {
            return undefined;
        }
        let row = numRows - 1;
        while (row >= 0 && this.board[row][col]) {
            row--;
        }
        if (row < 0) {
            return undefined;
        }
        return [row, col];
    }

    makeMove(move) {
        let oldBoardValue = this.boardValue;
        this.board[move[0]][move[1]] = this.currentPlayer;
        if (move[0] == 0) {
            this.isFull = this.checkIfFull();
        }
        for (let quadNumber of this.gridToQuads[move[0]][move[1]]) {
            let quad = this.quads[quadNumber];
            this.boardValue -= this.getQuadValue(quad);
            quad[this.currentPlayer]++;
            this.boardValue += this.getQuadValue(quad);
        }
        this.switchPlayers();
        return oldBoardValue;
    }

    revertMove(move, oldBoardValue) {
        this.switchPlayers();
        this.board[move[0]][move[1]] = 0;
        for (let quadNumber of this.gridToQuads[move[0]][move[1]]) {
            let quad = this.quads[quadNumber];
            quad[this.currentPlayer]--;
        }
        this.boardValue = oldBoardValue;
        this.isFull = false;
    }

    checkIfFull() {
        for (let col = 0; col < numCols; col++) {
            if (this.board[0][col] == 0) {
                return false;
            }
        }
        return true;
    }

    switchPlayers() {
        this.currentPlayer = 3 - this.currentPlayer;
    }
    
    getQuadValue(quad) {
        // Check if occupied by both players
        if (quad[1] != 0 && quad[2] != 0) {
            return 0;
        }
        let value = this.weights[quad[1] + quad[2]];
        if (quad[2] != 0) {
            value *= -1;
        }
        return value;
    }

    updateConfiguration() {
        this.weights[2] = this.config.weight2;
        this.weights[3] = this.config.weight3;
        this.boardValue = 0;
        for (let quad of this.quads) {
            this.boardValue += this.getQuadValue(quad);
        }
    }
}