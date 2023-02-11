const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const PubSub = require('./pubsub');

const app = express();
const DEFAULT_PORT = 3000;
const HOSTNAME = process.env.HOSTNAME || 'localhost';

// initialize the blockchain
const blockchain = new Blockchain();
// setup pubsub and broadcast chain
const pubsub = new PubSub({ blockchain });

const ROOT_NODE_ADDRESS = `http://${HOSTNAME}:${DEFAULT_PORT}`;


setTimeout(() => pubsub.broadcastChain(), 1000);

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

const syncChain = () => {
    request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const rootChain = JSON.parse(body);
            console.log('Replace chain on a sync with', rootChain);
            blockchain.replaceChain(rootChain);
        }
    })
};

// start the server
let PEER_PORT;
if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}
const PORT = PEER_PORT || process.env.PORT || DEFAULT_PORT;
app.listen(PORT, () => {
    console.log(`Listening at ${HOSTNAME}:${PORT}...`)
    syncChain();
});