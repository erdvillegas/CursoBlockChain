import Transaction from './transaction';
import Wallet from './wallet';

describe('Transaction', () => {
    let wallet;
    let transaction;
    let ammount;
    let recipentAddress;

    beforeEach(() => {
        wallet = new Wallet();
        recipentAddress = 'r3cip13nt';
        ammount = 5;
        transaction = Transaction.create(wallet, recipentAddress, ammount);
    });

    it('outputs the `ammount` substracted from the wallet', () => {
        const output = transaction.outputs.find(({ address }) => address === wallet.publicKey);
        expect(output.ammount).toEqual(wallet.balance - ammount);
    });

    it('outputs the `ammount` added from the wallet', () => {
        const output = transaction.outputs.find(({ address }) => address === recipentAddress);
        expect(output.ammount).toEqual(ammount);
    });

    describe('transacting with amount that exceeds the balance', () => {
        beforeEach(() => {
            ammount = 500;
            transaction = undefined;
        });

        it('does  not create the transaction', () => {
            expect(() => {
                transaction = Transaction.create(wallet, recipentAddress, ammount);
            }).toThrowError(`Ammount: ${ammount} exceeds balance.`);
        });
    });

    it('inputs the balance of the wallet', () => {
        expect(transaction.input.ammount).toEqual(wallet.balance);
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
        transaction.outputs[0].ammount = 500;
        expect(Transaction.verify(transaction)).toBe(false);
    });

    describe('and updating a transaction', () => {
        let nextAmmount;
        let nextRecipient;

        beforeEach(() => {
            nextAmmount = 3;
            nextRecipient = 'nxT-aDdRe22';
            transaction = transaction.update(wallet, nextRecipient, nextAmmount);
        });

        it('substract the next ammount from the sender wallet', () => {
            const output = transaction.outputs.find(({ address }) => address === wallet.publicKey);
            expect(output.ammount).toEqual(wallet.balance - ammount - nextAmmount);
        });

        it('outputs an ammount for the next recipient', () => {
            const output = transaction.outputs.find(({ address }) => address === nextRecipient);
            expect(output.ammount).toEqual(nextAmmount);
        });
    });
});