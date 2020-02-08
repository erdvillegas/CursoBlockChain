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

    toString() {
        const {
            timestamp,
            previousHash,
            hash,
            data
        } = this;

        return `Block -
        timestamp: ${timestamp}
        previousHash: ${previousHash}
        hash: ${hash}
        data: ${data}`;
    }
}

export default Block;