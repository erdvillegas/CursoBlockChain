import express from 'express';
import bodyParser from 'body-parser';
import BlockChain, { Block } from '../blockchain';
import P2PServices from '../services/p2p';

const { HTTP_PORT = 3000 } = process.env;

const app = express();
const blockChain = new BlockChain();
const p2pService = new P2PServices(blockChain);

app.use(bodyParser.json());

app.get('/blocks', (req, res) => {
    res.json(blockChain.blocks);
});

app.post('/mine', (req, res) => {
    const { body: { data } } = req;
    const block = blockChain.addBlock(data);

    p2pService.sync();
    res.json({
        blocks: blockChain.blocks.length,
        block
    });

});

app.listen(HTTP_PORT, () => {
    console.log(`Serivec HTTP:${HTTP_PORT} ...listening`);
    p2pService.listen();
});
