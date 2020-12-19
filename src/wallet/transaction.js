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

        transaction.input = Transaction.sign(transaction, senderWallet);
        return transaction;
    }

    static verify(transaction) {
        const { input: { address, signature }, outputs } = transaction;
        return eliptic.verifySignature(address, signature, outputs);
    }

    static sign(transaction, senderWallet) {
        return {
            timestamp: Date.now(),
            ammount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(transaction.outputs)
        };
    }

    update(senderWallet, recipentAddress, ammount) {
        const senderOutput = this.outputs.find((output) => output.address === senderWallet.publicKey);

        if (ammount > senderOutput.ammount) throw new Error(`Ammount: ${ammount} exceeds balance`);
        senderOutput.ammount -= ammount;
        this.outputs.push({ ammount, address: recipentAddress });
        this.input = Transaction.sign(this, senderWallet);

        return this;
    }
}

export default Transaction;