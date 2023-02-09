const Block = require("./block");

class Blockchain {
    constructor() {
        const genesisBlock = Block.genesis();
        this.chain = [genesisBlock]
    }
    addBlock({ data }) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length - 1],
            data
        })
        this.chain.push(newBlock);
    }
}

module.exports = Blockchain;