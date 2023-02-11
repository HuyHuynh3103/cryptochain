const { STARTING_BALANCE } = require('../config')
const { ec } = require('../util');
const cryptoHash = requie('../util/crypto-hash');
class Wallet {
    constructor() {
        this.balance = STARTING_BALANCE;
        this.keyPair = ec.genKeyPair();
        this.publicKey = keyPair.getPublic().encode('hex');
    }
    sign(data) {
        return this.keyPair.sign(cryptoHash(data))
    }
}

module.exports = Wallet;