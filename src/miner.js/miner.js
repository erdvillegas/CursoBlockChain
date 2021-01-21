
class Miner {
    constructor(blockchain, p2pservices, wallet) {
        this.blockchain = blockchain;
        this.p2pservices = p2pservices;
        this.wallet = wallet;
    }

    mine() {
        /**
         * 1.- Recuperar transaciones de la memoryPoll
         * 2.- Crear un bloque que consiste en una transacion valida
         * 3.- Sincronizar el nuevo bloque con la red
         * 4.- Limpiar transaciones de la memorypool
         * 5.- Comunicar del borrado para todos los nodos de la red
         */
    }
}

export class Miner;