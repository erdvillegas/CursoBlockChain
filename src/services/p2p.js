import WebSocket from 'ws';

const { P2P_PORT = 5000 } = process.env;

class P2PServices {
    constructor(blockchain) {
        this.blockchain = blockchain;
        this.sockets = [];
    }

    listen() {
        const server = new WebSocket.Server(P2P_PORT);
        server.on('connection', (socket) => { this.onConnection(socket) });
        console.log(`Services ws:${P2P_PORT} listening . . .`);
    }

    onConnection(socket) {
        console.log('[ws:socket] connected');
        this.sockets.push(socket);
    }
}

export default P2PServices;