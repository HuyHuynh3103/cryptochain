const Transaction = require('./transaction');
const Wallet = require('./index');
describe('Transaction', () => {
    let transaction, senderWallet, recipient, amount;

    beforeEach(() => {
        senderWallet = new Wallet();
        recipient = 'recipient-public-key';//public key of the actual wallet that we're sending to
        amount = 50; // See default balance in config.js
        transaction = new Transaction({ senderWallet, recipient, amount });
    })

    it('has an `id` property', () => {
        expect(transaction).toHaveProperty('id');
    });

    describe('outputMap', () => {
        it('has an `outputMap` property', () => {
            expect(transaction).toHaveProperty('outputMap');
        });

        it('outputs the amount to the recipient', () => {
            expect(transaction.outputMap[recipient]).toEqual(amount);
        });

        it('outputs the remaining balance for the `senderWallet`', () => {
            expect(transaction.outputMap[senderWallet.publicKey ]).toEqual(senderWallet.balance - amount);
        })
    });

});
