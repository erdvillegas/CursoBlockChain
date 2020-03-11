import Blockchain from '../blockchain';
import validate from './validate';

describe('validate()', () => {
    let blockchain;

    beforeEach(() => {
        blockchain = new Blockchain();
    });

    it('validate a valid chain', () => {
        blockchain.addBlock('bl4v-1');
        blockchain.addBlock('bl4v-2');

        blockchain.blocks.forEach(bloque => {
            console.log(bloque);
        });

        expect(validate(blockchain.blocks)).toBe(true);
    });
});