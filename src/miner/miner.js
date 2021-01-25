import { Transaction, blockchainwallet } from "../wallet";
import { MESSAGE } from "../services/p2p";


class Miner {
    constructor(blockchain, p2pservices, wallet) {
        this.blockchain = blockchain;
        this.p2pservices = p2pservices;
        this.wallet = wallet;
    }

    mine() {

        const {
            blockchain: {memoryPool},
            p2pservices,
            wallet
        } = this;

        if (memoryPool.transactions.length === 0) throw new Error('There are no unconfirmed transactions.');
        
        /**
         * 1.- Recuperar transaciones de la memoryPoll
         * 2.- Crear un bloque que consiste en una transacion valida
         * 3.- Sincronizar el nuevo bloque con la red
         * 4.- Limpiar transaciones de la memoryPool
         * 5.- Comunicar del borrado para todos los nodos de la red
         */
        memoryPool.transactions.push(Transaction.reward(wallet,blockchainwallet));
        const block = this.blockchain.addBlock(memoryPool.transactions);
        this.p2pservices.sync();
        memoryPool.wipe();
        p2pservices.broadcast(MESSAGE.WIPE);

        return block;
    }
}

export default Miner;