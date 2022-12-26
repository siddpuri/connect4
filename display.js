// Drawing constants
const frameColor = "#0000d0";
const playerColors = ["white", "red", "yellow"];
const faintPlayerColors = ["white", "#ffd0d0", "#ffffa0"];
const lineWidth = 2;
const edgePadding = 5;
const chipSize = 40;
const offsetFromEdge = edgePadding + chipSize / 2;
const chipPadding = 5;
const chipRadius = (chipSize - chipPadding) / 2;

// Display class
export default class Display {
    constructor(game, autoPlayer) {
        this.game = game;
        this.autoPlayer = autoPlayer;
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.ctx.lineWidth = lineWidth;
        this.ctx.strokeStyle = "black";
        this.previousPreview = undefined;
    }

    activateGame() {
        this.render();
        this.hookEvents();
    }

    render() {
        this.drawFrame();
        for (let row = 0; row < this.game.numRows; row++) {
            for (let col = 0; col < this.game.numCols; col++) {
                this.drawChip(playerColors[this.game.getChip(row, col)], [row, col]);
            }
        }
    }

    hookEvents() {
        this.canvas.onmouseenter = (e) => this.hover(e);
        this.canvas.onmousemove = (e) => this.hover(e);
        this.canvas.onmouseleave = (e) => this.clearPreview();
        this.canvas.onclick = (e) => this.playerMove(e);
        document.getElementById("play1Button").onclick = () => this.autoPlayOne();
        document.getElementById("playAllButton").onclick = () => this.autoPlayAll();
    }

    hover(event) {
        if (this.game.isActive) {
            let move = this.getMoveFromEvent(event);
            this.drawPreview(move);
        }
    }

    playerMove(event) {
        if (this.game.isActive) {
            let move = this.getMoveFromEvent(event);
            this.makeMove(move);
        }
    }

    autoPlayOne() {
        if (this.game.isActive) {
            this.game.isThinking = true;
            let move = this.autoPlayer.getMove();
            this.game.isThinking = false;
            this.makeMove(move);
        }
    }

    async autoPlayAll() {
        if (this.game.isActive) {
            this.game.isThinking = true;
            while (!this.game.hasWon) {
                let move = this.autoPlayer.getMove();
                this.makeMove(move);
                await new Promise(r => setTimeout(r, 10));
            }
            this.game.isThinking = false;
        }
    }

    makeMove(move) {
        this.clearPreview();
        this.drawChip(playerColors[this.game.currentPlayer], move);
        this.game.makeMove(move);
    }

    drawFrame() {
        const width = edgePadding + this.game.numCols * chipSize + edgePadding;
        const height = edgePadding + this.game.numRows * chipSize + edgePadding;
        this.drawRect(frameColor, 0, 0, width, height);
    }

    getMoveFromEvent(event) {
        let col = Math.round((event.offsetX - offsetFromEdge) / chipSize);
        return this.game.getMove(col);
    }

    drawPreview(move) {
        if (this.previousPreview) {
            this.drawChip(playerColors[0], this.previousPreview);
        }
        if (move) {
            this.drawChip(faintPlayerColors[this.game.currentPlayer], move);
        }
        this.previousPreview = move;
    }

    clearPreview() {
        this.drawPreview(undefined);
    }

    drawChip(color, move) {
        const x = offsetFromEdge + move[1] * chipSize;
        const y = offsetFromEdge + move[0] * chipSize;
        this.drawCircle(color, x, y, chipRadius);
    }

    drawRect(color, x, y, width, height) {
        this.ctx.fillStyle = color;
        this.ctx.strokeRect(x, y, width, height);
        this.ctx.fillRect(x + lineWidth / 2, y + lineWidth / 2, width - lineWidth, height - lineWidth);
    }

    drawCircle(color, x, y, radius) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius - lineWidth / 2, 2 * Math.PI, false);
        this.ctx.fill();
    }
}