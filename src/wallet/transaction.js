import uuidV1 from 'uuid/v1';
import { eliptic } from '../modules';

class Transaction {
    constructor() {
        this.id = uuidV1();
        this.input = null;
        this.outputs = [];
    }

    static create(senderWallet, recipienteAddress, ammount) {
        const { balance, publicKey } = senderWallet;

        if (ammount > balance) throw Error(`Ammount: ${ammount} exceeds balance.`);

        const transaction = new Transaction();
        transaction.outputs.push(...[
            { ammount: balance - ammount, address: publicKey },
            { ammount, address: recipienteAddress }
        ]);

        transaction.input = {
            timestamp: Date.now(),
            ammount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(transaction.outputs)
        };
        return transaction;
    }

    static verify(transaction) {
        const { input: { addres, signature }, outputs } = transaction;
        return eliptic.verifySignature(addres,signature,outputs);
    }
}

export default Transaction;