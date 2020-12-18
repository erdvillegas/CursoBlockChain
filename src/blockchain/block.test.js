import Block, { DIFFICULTY } from './block';

describe('Block', () => {
    let timeStamp;
    let previousBlock;
    let data;
    let hash;
    let nonce;
    let difficulty;

    beforeEach(() => {
        timeStamp = new Date(2010, 0, 1);
        previousBlock = Block.genesis;
        data = 't3st-d4t4';
        hash = "h4sh";
        nonce = 128;
        difficulty = DIFFICULTY;

    });

    it('Create a new instance with parameters', () => {
        const block = new Block(timeStamp, previousBlock.hash, hash, data,nonce,DIFFICULTY);
        expect(block.timestamp).toEqual(timeStamp);
        expect(block.previousHash).toEqual(previousBlock.hash);
        expect(block.data).toEqual(data);
        expect(block.hash).toEqual(hash);
        expect(block.nonce).toEqual(nonce);
    });

    it('use static mine()', () => {
        const block = Block.mine(previousBlock, data);
        const { difficulty } = block;

        expect(block.hash.length).toEqual(64);
        expect(block.hash.substring(0,difficulty)).toEqual("0".repeat(difficulty));
        expect(block.previousHash).toEqual(previousBlock.hash);
        expect(block.nonce).not.toEqual(0);
        expect(block.data).toEqual(data);
    });

    it('use static hash', () => {
        hash = Block.hash(timeStamp, previousBlock.hash, data,nonce);
        const hashOutput = '811072cfc4c9a5ef0f47dba3c87d4af35cf70a748f5391bc56803a03929e6957';

        expect(hash).toEqual(hashOutput);
    });

    it('use toString()', () => {
        const block = Block.mine(previousBlock, data);
        console.log(block.toString());
        expect(typeof (block.toString())).toEqual('string');
    });

});