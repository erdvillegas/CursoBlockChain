import Block from './block';

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
}

export default Blockchain;