import { SHA256 } from 'crypto-js';

const DIFICULTY = 3;

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
    constructor(timestamp, previousHash, hash, data, nonce) {
        this.timestamp = timestamp;
        this.previousHash = previousHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
    }

    /**
     * Obtiene el bloque genesis
     */
    static get genesis() {
        const timestamp = (new Date(2000, 0, 1)).getTime();
        return new this(timestamp, undefined, 'g3n3sis-h4sh', 'Hello World',0);
    }

    /**
     * Trata de minar el bloque 
     */
    static mine(previousBlock, data) {
        const { hash: previousHash } = previousBlock;
        let hash;
        let nonce = 0;
        let timestamp;
        
        do {
            timestamp = Date.now();
            nonce+=1;
            hash = Block.hash(timestamp,previousHash,data,nonce);
        } while(hash.substring(0,DIFICULTY) !== '0'.repeat(DIFICULTY));

        return new this(timestamp, previousHash, hash, data, nonce);
    }

    /**
     * Obtiene un hash con los datos procesados
     * @param {*} timestamp Marca de tiempo
     * @param {*} previousHash Hash previo
     * @param {*} data Datos
     * @param {*} nonce Numero pseudoaleatorio
     */
    static hash(timestamp, previousHash, data, nonce) {
        return SHA256(`${timestamp}${previousHash}${data}${nonce}`).toString();
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
            nonce
        } = this;

        return `Block -
        timestamp: ${timestamp}
        previousHash: ${previousHash}
        hash: ${hash}
        data: ${data}
        nonce: ${nonce}`;
    }
}

export default Block;