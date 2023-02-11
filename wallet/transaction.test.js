const Transaction = require('./transaction');
const Wallet = require('./index');
const { verifySignature } = require('../util');

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
            expect(transaction.outputMap[senderWallet.publicKey]).toEqual(senderWallet.balance - amount);
        })
    });
    describe('input', () => {
        it('has an `input` property', () => {
            expect(transaction).toHaveProperty('input');
        });
        it('has a `timestamp` in the input', ()=>{
            expect(transaction.input).toHaveProperty('timestamp');
        });
        it('sets the `amount` in input to the `senderWallet` balance', ()=>{
            expect(transaction.input.amount).toEqual(senderWallet.balance); 
        });
        it('sets the `address` in input to the `senderWallet` public key', () => {
            expect(transaction.input.address).toEqual(senderWallet.publicKey);
        });
        it('signs the input', () => {
            expect(verifySignature({
                publicKey: senderWallet.publicKey,
                data: transaction.outputMap,
                signature: transaction.input.signature
            })).toBe(true);
        })
    });

});
