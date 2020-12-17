import uuidV1 from 'uuid/v1';

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

        return transaction;
    }
}

export default Transaction;