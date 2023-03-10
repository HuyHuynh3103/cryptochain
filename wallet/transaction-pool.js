class TransactionPool {
    constructor() {
        this.transactionMap = {};
    }
    setTransaction(transaction) {
        this.transactionMap[transaction.id] = transaction;
    }
    existingTransaction({ inputAddress }) {
        const transactions = Object.values(this.transactionMap);
        return transactions.find((transaction) => transaction.input.address === inputAddress);
    }
    setMap(transactionMap) {
        this.transactionMap = transactionMap;
    }
}

module.exports = TransactionPool;