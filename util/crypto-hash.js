const crypto = require('crypto');
const cryptoHash = (...args) => {
    const hash = crypto.createHash('sha256');
    hash.update(args.map(arg => JSON.stringify(arg)).sort().join(' '));

    // represent the result of a hash as hexadecimal form
    return hash.digest('hex');
}

module.exports = cryptoHash;