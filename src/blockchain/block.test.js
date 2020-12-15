import Block from './block';

describe('Block', () => {
    let timeStamp;
    let previousBlock;
    let data;
    let hash;

    beforeEach(() => {
        timeStamp = new Date(2010, 0, 1);
        previousBlock = Block.genesis;
        data = 't3st-d4t4';
        hash = "h4sh";
    });

    it('Create a new instance with parameters', () => {
        const block = new Block(timeStamp, previousBlock.hash, hash, data)
        expect(block.timestamp).toEqual(timeStamp);
        expect(block.previousHash).toEqual(previousBlock.hash);
        expect(block.data).toEqual(data);
        expect(block.hash).toEqual(hash);
    });

    it('use static mine()', () => {
        const block = Block.mine(previousBlock, data);

        expect(block.hash.length).toEqual(64);
        expect(block.previousHash).toEqual(previousBlock.hash);
        expect(block.data).toEqual(data);
    });

    it('use static hash', () => {
        hash = Block.hash(timeStamp, previousBlock.hash, data);
        const hashOutput = '0fbc94e58d90b0300e622e1aa78e61a5c8e138ede3ffc1e23a09fc0ec844fbe8';

        expect(hash).toEqual(hashOutput);
    });

    it('use toString()', () => {
        const block = Block.mine(previousBlock, data);
        expect(typeof(block.toString())).toEqual('string');
    });
});