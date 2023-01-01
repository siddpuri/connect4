// Configuration class
export default class Configuration {
    configurations = [{ depth: 7, weight2: 5, weight3: 16, numDice: 5, numSides: 2 }];

    constructor() {
        this.setConfiguration(0);
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

    createNewConfiguration() {
        this.configurations.push({ ... configurations[0] });
        return this.configurations.length - 1;
    }

    setConfiguration(n) {
        this.configuration = this.configurations[n];
    }
}