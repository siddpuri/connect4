// Configuration class
export default class Configuration {
    configurations = [
        { depth: 6, weight2: 5, weight3: 20, numDice: 5, numSides: 2 },
        { depth: 6, weight2: 4, weight3: 20, numDice: 5, numSides: 2 },
    ];

    constructor() {
        this.configuration = this.configurations[0];
    }

    get depth() { return this.configuration.depth; }
    get weight2() { return this.configuration.weight2; }
    get weight3() { return this.configuration.weight3; }

    get randomness() {
        let result = 0;
        for (let i = 0; i < this.configuration.numDice; i++) {
            result += Math.random() * this.configuration.numSides;
        }
        return result;
    }

    setConfiguration(n) {
        this.configuration = this.configurations[n];
    }
}