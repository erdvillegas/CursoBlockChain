import Block from './block';
import validate from './modules/validate';

/**
 * Cadena de bloques
 */
class Blockchain {
    constructor() {
        this.blocks = [Block.genesis];
    }

    /**
     * Agrega un nuevo bloque a la cadena
     * @param {*} data Datos que se agregaran
     */
    addBlock(data) {
        const previousBlock = this.blocks[this.blocks.length - 1];
        const block = Block.mine(previousBlock, data);

        this.blocks.push(block);

        return block;
    }

    /**
     * Remplaza la cadena original
     * @param {*} newBlocks Lista de bloques
     */
    replace(newBlocks = []) {
        if (newBlocks.length < this.blocks.length) throw Error("Received chain is not longer than current chain.");

        try {
            validate(newBlocks);
        } catch (error) {
            throw Error('Received chain is invalid');
        }

        this.blocks = newBlocks;

        return this.blocks;
    }
}

export default Blockchain;