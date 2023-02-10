const Block = require("./block");
const cryptoHash = require("./crypto-hash");

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
    static isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        }
        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const { timestamp, lastHash, hash, data, nonce, difficulty } = block;

            const actualLastHash = chain[i - 1].hash;

            if (lastHash !== actualLastHash) return false;
            const validatedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
            if (hash !== validatedHash) return false;
        }
        return true;
    }
    replaceChain(chain) {
        if (chain.length <= this.chain.length) {
            console.error('The incoming chain must be longer');
            return;
        }
        if (!Blockchain.isValidChain(chain)) {
            console.error('The incoming chain must be valid')
            return
        }
        console.log('Replacement success')
        this.chain = chain;
    }
}

module.exports = Blockchain;