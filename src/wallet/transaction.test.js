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
});