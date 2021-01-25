
import { eliptic, hash } from '../modules';
import Transaction from "./transaction";

const INITIAL_BALANCE = 100;


class Wallet {
    constructor(blockchain, initialBalance = INITIAL_BALANCE) {
        this.balance = initialBalance;
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
    createTransaction(recipentAddress, amount) {
        const { currentBalance, blockchain: { memoryPool } } = this;

        if (amount > currentBalance) throw new Error(`Ammout: ${amount} exceeds current balance`);
        let tx = memoryPool.find(this.publicKey);
        if (tx) {
            tx.update(this, recipentAddress, amount);
        } else {
            tx = Transaction.create(this, recipentAddress, amount);
            memoryPool.addOrUpdate(tx);
        }
        return tx;
    }

    get currentBalance() {
        const { blockchain: { blocks = [] }, publicKey } = this;
        let { balance } = this;
        const txs = [];

        blocks.forEach(({ data = [] }) => {
            if (Array.isArray(data)) data.forEach((tx) => txs.push(tx));
        });

        const walletInputsTxs = txs.filter((tx) => tx.input.address === publicKey);
        let timestamp = 0;

        if (walletInputsTxs.length > 0) {
            const recentInputTx = walletInputsTxs.sort((a, b) => a.input.timestamp - b.input.timestamp).pop();

            balance = recentInputTx.outputs.find(({ address }) => address === publicKey).amount;
            timestamp = recentInputTx.input.timestamp;
        }

        txs.filter(({ input }) => input.timestamp > timestamp)
            .forEach(({ outputs }) => {
                outputs.find(({ address, amount }) => {
                    if (address === publicKey) balance += amount;
                });
            });

        return balance;
    }
}

export { INITIAL_BALANCE };
export default Wallet;