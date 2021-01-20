import Wallet, { INITIAL_BALANCE } from './wallet';
import Blockchain from "../blockchain";

describe('wallet', () => {
    let wallet;
    let blockchain;

    beforeEach(() => {
        blockchain = new Blockchain();
        wallet = new Wallet(blockchain);
    });

    it('it is a healty wallet', () => {
        expect(wallet.balance).toEqual(INITIAL_BALANCE);
        expect(typeof wallet.keyPair).toEqual('object');
        expect(typeof wallet.publicKey).toEqual('string');
        expect(wallet.publicKey.length).toEqual(130);
    });

    it('it use sign()', () => {
        const signature = wallet.sign('h3l0');
        expect(typeof signature).toEqual('object');
        expect(signature).toEqual(wallet.sign('h3l0'));
    });

    describe('creating a transaction', () => {
        let tx;
        let recipentAddress;
        let amount;

        beforeEach(() => {
            recipentAddress = 'r4nd0m-4ddr35';
            amount = 5;
            tx = wallet.createTransaction(recipentAddress, amount);
        });

        describe('and doing the same transaction', () => {
            beforeEach(() => {
                tx = wallet.createTransaction(recipentAddress, amount);
            });

            it('double the `ammount` substracted from the wallet balance', () => {
                const output = tx.outputs.find(({ address }) => address === wallet.publicKey);
                expect(output.amount).toEqual(wallet.balance - (amount * 2));
            });

            it('clones the `ammount` output for the rcipient', () => {
                const amounts = tx.outputs.filter(({ address }) =>address === recipentAddress).map(output => output.amount);
                expect(amounts).toEqual([amount, amount]);
            });
        });
    });
});