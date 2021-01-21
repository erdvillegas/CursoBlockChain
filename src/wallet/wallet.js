
import {eliptic, hash} from '../modules';
import  Transaction  from "./transaction";

const INITIAL_BALANCE = 100;


class Wallet {
    constructor(blockchain) {
        this.balance = INITIAL_BALANCE;
        this.keyPair = eliptic.createKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
        this.blockchain = blockchain;
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

    /**
     * Crea una transaccion
     * @param {*} recipentAddress 
     * @param {*} amount 
     * @returns
     */
    createTransaction(recipentAddress, amount){
        const { balance, blockchain: {memoryPool} } = this;

        if (amount > balance) throw new Error(`Ammout: ${amount} exceeds current balance`);
        let tx = memoryPool.find(this.publicKey);
        if (tx) {
            tx.update(this, recipentAddress, amount);
        }else {
            tx = Transaction.create(this,recipentAddress, amount);
            memoryPool.addOrUpdate(tx);
        }
        return tx;
    }
}

export { INITIAL_BALANCE };
export default Wallet;