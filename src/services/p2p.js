import { json } from 'body-parser';
import WebSocket from 'ws';

const { P2P_PORT = 5000, PEERS } = process.env;
const peers = PEERS ? PEERS.split(',') : [];
const MESSAGE = {
    BLOCKS: 'blocks',
    TX: 'transactions',
    WIPE: 'whipe_memorypool'
};

class P2PServices {
    constructor(blockchain) {
        this.blockchain = blockchain;
        this.sockets = [];
    }

    listen() {
        const server = new WebSocket.Server({ port: P2P_PORT });
        server.on('connection', (socket) => { this.onConnection(socket) });
        console.log(`Services ws:${P2P_PORT} listening . . .`);

        peers.forEach((peer) => {
            const socket = new WebSocket(peer);
            socket.on('open', () => this.onConnection(socket));
        });
    }

    onConnection(socket) {
        const { blockchain: { blocks } } = this;
        console.log('[ws:socket] connected');
        this.sockets.push(socket);

        socket.on('message', (message) => {
            const { type, value } = JSON.parse(message);

            try {
                if (type == MESSAGE.BLOCKS) { this.blockchain.replace(value) }
                else if (type == MESSAGE.TX) this.blockchain.memoryPool.addOrUpdate(value);
                else if (type == MESSAGE.WIPE) blockchain.memoryPool.wipe();
            } catch (error) {
                console.error(`[ws:Error] error ${error}`);
                throw Error(error);
            }

            console.log({ type, value });
        });

        socket.send(JSON.stringify({ type: MESSAGE.BLOCKS, value: blocks }));
    }

    sync() {
        const { blockchain: { blocks } } = this;
        this.broadcast(MESSAGE.BLOCKS, blocks);
    }

    broadcast(type, value) {
        console.log(`$[ws:broadcast] ${type}`);
        const message = JSON.stringify({ type, value });
        this.sockets.forEach((socket) => socket.send(message));
    }
}

export { MESSAGE };
export default P2PServices;