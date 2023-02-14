const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const PubSub = require('./app/pubsub');
const TransactionPool = require('./wallet/transaction-pool');
const Wallet = require('./wallet');
const Transaction = require('./wallet/transaction');


const app = express();
const DEFAULT_PORT = 3000;
const HOSTNAME = process.env.HOSTNAME || 'localhost';

// initialize the blockchain
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
// setup pubsub and broadcast chain
const pubsub = new PubSub({ blockchain, transactionPool });
// const pubsub = new PubSub({ blockchain, transactionPool, wallet }); // for PubNub

const ROOT_NODE_ADDRESS = `http://${HOSTNAME}:${DEFAULT_PORT}`;

// config the environment
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}


// use middlewares 
app.use(bodyParser.json())

// define the route and implement its logical function
app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});
app.post('/api/mine', (req, res) => {
    const { data } = req.body;
    blockchain.addBlock({ data });
    pubsub.broadcastChain();
    res.redirect('/api/blocks');
});
app.post('/api/transact', (req, res) => {
    const { amount, recipient } = req.body;
    let transaction = transactionPool.existingTransaction({ inputAddress: wallet.publicKey })
    try {
        if (transaction) {
            transaction.update({ senderWallet: wallet, recipient, wallet });
        } else {
            transaction = wallet.createTransaction({ amount, recipient });
        }
    } catch (error) {
        return res.status(400).json({ type: 'error', message: error })
    }
    transactionPool.setTransaction(transaction);
    pubsub.broadcastTransaction(transaction)
    res.json({
        type: 'success',
        transaction
    });
})
app.get('/api/transaction-pool-map', (req, res) => {
    res.json(transactionPool.transactionMap);
})



const syncWithRootState = () => {
    request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const rootChain = JSON.parse(body);
            console.log('Replace chain on a sync with', rootChain);
            blockchain.replaceChain(rootChain);

        }
    })
    request({ url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map` }, (error, response, body) => { 
        if (!error && response.statusCode === 200) {
            const rootTransactionPoolMap = JSON.parse(body);
            console.log('Replace transaction pool map on a sync with', rootTransactionPoolMap);
            transactionPool.setMap(rootTransactionPoolMap);
        }

    })
};

// start the server
let PEER_PORT;
if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}
const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
    console.log(`Listening at ${HOSTNAME}:${PORT}...`)
    if (PORT !== DEFAULT_PORT) {
        syncWithRootState();
    }
});