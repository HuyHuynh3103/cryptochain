const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const PubSub = require('./pubsub');

const app = express();
// initialize the blockchain
const blockchain = new Blockchain();
// setup pubsub and broadcast chain
const pubsub = new PubSub({ blockchain });
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

// start the server
const DEFAULT_PORT = 3000;
let PEER_PORT;
if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}
const PORT = PEER_PORT || process.env.PORT || DEFAULT_PORT;
const HOSTNAME = process.env.HOSTNAME || 'localhost';

app.listen(PORT, () => console.log(`Listening at ${HOSTNAME}:${PORT}...`));