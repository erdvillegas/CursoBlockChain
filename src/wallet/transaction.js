import uuidV1 from 'uuid/v1';
import { eliptic } from '../modules';

const REWARD = 1;

class Transaction {
    constructor() {
        this.id = uuidV1();
        this.input = null;
        this.outputs = [];
    }

    static create(senderWallet, recipienteAddress, amount) {
        const { balance, publicKey } = senderWallet;

        if (amount > balance) throw Error(`Amount: ${amount} exceeds balance.`);

        const transaction = new Transaction();
        transaction.outputs.push(...[
            { amount: balance - amount, address: publicKey },
            { amount, address: recipienteAddress }
        ]);

        transaction.input = Transaction.sign(transaction, senderWallet);
        return transaction;
    }

    static reward(minerwallet, blockchainwallet) {
        return this.create(blockchainwallet, minerwallet.publicKey, REWARD);
    }

    static verify(transaction) {
        const { input: { address, signature }, outputs } = transaction;
        return eliptic.verifySignature(address, signature, outputs);
    }

    static sign(transaction, senderWallet) {
        return {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(transaction.outputs)
        };
    }

    update(senderWallet, recipentAddress, amount) {
        const senderOutput = this.outputs.find((output) => output.address === senderWallet.publicKey);

        if (amount > senderOutput.amount) throw new Error(`Amount: ${amount} exceeds balance`);
        senderOutput.amount -= amount;
        this.outputs.push({ amount, address: recipentAddress });
        this.input = Transaction.sign(this, senderWallet);

        return this;
    }
}

export { REWARD };
export default Transaction;