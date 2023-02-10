const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');

const app = express();
// initialize the blockchain
const blockchain = new Blockchain();

// use middlewares 
app.use(bodyParser.json())

// define the route and implement its logical function
app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});
app.post('/api/mine', (req, res) => {
    const { data } = req.body;
    blockchain.addBlock({ data });
    res.redirect('/api/blocks');
});

// start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Listening at localhost:${PORT} ...`));