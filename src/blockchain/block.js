import { SHA256 } from 'crypto-js';
import adjustDifficulty from '../blockchain/modules/adjustDifficulty';

const DIFFICULTY = 3;

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
     * @param {*} nonce Numero pseudoaleatorio
     * @param {*} difficulty Dificultad del algoritmo
     */
    constructor(timestamp, previousHash, hash, data, nonce, difficulty) {
        this.timestamp = timestamp;
        this.previousHash = previousHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }

    /**
     * Obtiene el bloque genesis
     */
    static get genesis() {
        const timestamp = (new Date(2000, 0, 1)).getTime();
        return new this(timestamp, undefined, 'g3n3sis-h4sh', 'Hello World',0,DIFFICULTY);
    }

    /**
     * Trata de minar el bloque 
     */
    static mine(previousBlock, data) {
        const { hash: previousHash } = previousBlock;
        let hash;
        let nonce = 0;
        let timestamp;
        let {difficulty} = previousBlock;
        
        do {
            timestamp = Date.now();
            nonce+=1;
            difficulty = adjustDifficulty(previousBlock,timestamp);
            hash = Block.hash(timestamp,previousHash,data,nonce,difficulty);
        } while(hash.substring(0,difficulty) !== '0'.repeat(difficulty));

        return new this(timestamp, previousHash, hash, data, nonce,difficulty);
    }

    /**
     * Obtiene un hash con los datos procesados
     * @param {*} timestamp Marca de tiempo
     * @param {*} previousHash Hash previo
     * @param {*} data Datos
     * @param {*} nonce Numero pseudoaleatorio
     * @param {*} difficulty Dificultad del algoritmo
     */
    static hash(timestamp, previousHash, data, nonce, difficulty) {
        return SHA256(`${timestamp}${previousHash}${data}${nonce}${difficulty}`).toString();
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
            nonce,
            difficulty
        } = this;

        return `Block -
        timestamp:      ${timestamp}
        previousHash:   ${previousHash}
        hash:           ${hash}
        data:           ${data}
        nonce:          ${nonce}
        difficulty:     ${difficulty}`;
    }
}

export { DIFFICULTY };
export default Block;