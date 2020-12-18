import {eliptic, hash} from '../modules';

const INITIAL_BALANCE = 100;


class Wallet {
    constructor() {
        this.balance = INITIAL_BALANCE;
        this.keyPair = eliptic.createKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    toString() {
        const { balance, publicKey } = this;

        return `$Wallet - 
            publicKey   :${this.publicKey.toString()}
            BALANCE     :${this.balance}
        `;
    }

    /**
     * Firma una transaccion
     * @param {*} data Datos a encriptar
     */
    sign(data) {
        return this.keyPair.sign(hash(data));
    }
}

export { INITIAL_BALANCE };
export default Wallet;