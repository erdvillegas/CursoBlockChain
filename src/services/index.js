import express from 'express';
import bodyParser from 'body-parser';
import BlockChain, { Block } from '../blockchain';

const { HTTP_PORT = 3000 } = process.env;

const app = express();
const blockChain = new BlockChain();

app.use(bodyParser.json());

app.get('/blocks', (req, res) => {
    res.json(blockChain.blocks);
});

app.post('/mine', (req, res) => {
    const { body: { data } } = req;
    const block = blockChain.addBlock(data);

    res.json({
        blocks: blockChain.blocks.length,
        block
    });

});

app.listen(HTTP_PORT, () => {
    console.log(`Serivec HTTP:${HTTP_PORT} listening`);
});
