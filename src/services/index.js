import express from 'express';
import bodyParser from 'body-parser';
import BlockChain, { Block } from '../blockchain';
import Wallet from "../wallet";
import P2PServices, {MESSAGE} from '../services/p2p';
import Miner from '../miner/miner';

const { HTTP_PORT = 3000 } = process.env;

const app = express();
const blockChain = new BlockChain();
const wallet = new Wallet(blockChain);
const walletMiner = new Wallet(blockChain);
const p2pService = new P2PServices(blockChain);
const miner = new Miner(blockChain,p2pService,walletMiner);

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

app.get('/transactions', (req, res)=>{
    const { memoryPool: {transactions}} = blockChain;
    res.json(transactions);
});

app.post('/transactions', (req, res)=>{
    const { body: {recipient, amount}} = req;
    try {
        const tx = wallet.createTransaction(recipient, amount);
        p2pService.broadcast(MESSAGE.TX,tx);
        res.json(tx);
    } catch (error) {
        res.json({error: error.message});
    }

});

app.get('/mine/transactions', (req, res) => {
    try{
        miner.mine();
        res.redirect('/blocks');
    }catch (error){
        res.json({error: error.message});
    }
});


app.listen(HTTP_PORT, () => {
    console.log(`Serivec HTTP:${HTTP_PORT} ...listening`);
    p2pService.listen();
});
