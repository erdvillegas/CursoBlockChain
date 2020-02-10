/**
 * Bloque de la cadena
 */
class Block {
    /**
     *
     * @param {*} timestamp Marca de tiempo
     * @param {*} previousHash Hash previo
     * @param {*} hash Hash actual
     * @param {*} data Datos a procesar
     */
    constructor(timestamp, previousHash, hash, data) {
        this.timestamp = timestamp;
        this.previousHash = previousHash;
        this.hash = hash;
        this.data = data;
    }

    /**
     * Obtiene el bloque genesis
     */
    static get genesis() {
        const timestamp = (new Date(2000, 0, 1)).getTime();
        return new this(timestamp, undefined, 'g3n3sis-h4sh', 'Hello World');
    }

    /**
     * Trata de minar el bloque
     */
    static mine(previousBlock, data) {
        const timestamp = Date.now();
        const hash = '@TODO-HASH';
        const { hash: previousHash } = previousBlock;

        return new this(timestamp, previousHash, hash, data);
    }

    /**
     * Despliega el objeto en formato de texto
     */
    toString() {
        const {
            timestamp,
            previousHash,
            hash,
            data,
        } = this;

        return `Block -
        timestamp: ${timestamp}
        previousHash: ${previousHash}
        hash: ${hash}
        data: ${data}`;
    }
}

export default Block;