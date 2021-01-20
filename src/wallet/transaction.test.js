import Transaction from './transaction';
import Wallet from './wallet';

describe('Transaction', () => {
    let wallet;
    let transaction;
    let amount;
    let recipentAddress;

    beforeEach(() => {
        wallet = new Wallet();
        recipentAddress = 'r3cip13nt';
        amount = 5;
        transaction = Transaction.create(wallet, recipentAddress, amount);
    });

    it('outputs the `amount` substracted from the wallet', () => {
        const output = transaction.outputs.find(({ address }) => address === wallet.publicKey);
        expect(output.amount).toEqual(wallet.balance - amount);
    });

    it('outputs the `amount` added from the wallet', () => {
        const output = transaction.outputs.find(({ address }) => address === recipentAddress);
        expect(output.amount).toEqual(amount);
    });

    describe('transacting with amount that exceeds the balance', () => {
        beforeEach(() => {
            amount = 500;
            transaction = undefined;
        });

        it('does  not create the transaction', () => {
            expect(() => {
                transaction = Transaction.create(wallet, recipentAddress, amount);
            }).toThrowError(`Amount: ${amount} exceeds balance.`);
        });
    });

    it('inputs the balance of the wallet', () => {
        expect(transaction.input.amount).toEqual(wallet.balance);
    });

    it('inputs the sender address of the wallet', () => {
        expect(transaction.input.address).toEqual(wallet.publicKey);
    });

    it('inputs has a signature usign the wallet', () => {
        expect(typeof transaction.input.signature).toEqual('object');
        expect(transaction.input.signature).toEqual(wallet.sign(transaction.outputs));
    });

    it('use sign()', () => {
        const signature = wallet.sign('hello');
        expect(typeof signature).toEqual('object');
        expect(signature).toEqual(wallet.sign('hello'));
    });

    it('validates a valid transaction', () => {
        expect(Transaction.verify(transaction)).toBe(true);
    });

    it('invalidates a corrupted transaction', () => {
        transaction.outputs[0].amount = 500;
        expect(Transaction.verify(transaction)).toBe(false);
    });

    describe('and updating a transaction', () => {
        let nextAmount;
        let nextRecipient;

        beforeEach(() => {
            nextAmount = 3;
            nextRecipient = 'nxT-aDdRe22';
            transaction = transaction.update(wallet, nextRecipient, nextAmount);
        });

        it('substract the next amount from the sender wallet', () => {
            const output = transaction.outputs.find(({ address }) => address === wallet.publicKey);
            expect(output.amount).toEqual(wallet.balance - amount - nextAmount);
        });

        it('outputs an amount for the next recipient', () => {
            const output = transaction.outputs.find(({ address }) => address === nextRecipient);
            expect(output.amount).toEqual(nextAmount);
        });
    });
});