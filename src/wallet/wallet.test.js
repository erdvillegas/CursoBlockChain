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
                const amounts = tx.outputs.filter(({ address }) => address === recipentAddress).map(output => output.amount);
                expect(amounts).toEqual([amount, amount]);
            });
        });
    });

    describe('calculating the current balance', () => {
        let addBalance;
        let times;
        let senderwallet;

        beforeEach(() => {
            addBalance = 16;
            times = 3;
            senderwallet = new Wallet(blockchain);

            for (let i = 0; i < times; i+=1) {
                senderwallet.createTransaction(wallet.publicKey, addBalance);
            }

            blockchain.addBlock(blockchain.memoryPool.transactions);
        });

        it('calculates the balance for blockchain txs matching the recipient', () => {
            expect(wallet.currentBalance).toEqual(INITIAL_BALANCE + (addBalance * times));
        });

        it('calculate the balance for blockchain txs matching the sender', () => {
            expect(senderwallet.currentBalance).toEqual(INITIAL_BALANCE - (addBalance * times));
        });

        describe('and the recipient conducts a transaction', () => {
            let substractBalance;
            let recipientBalance;
            beforeEach(() => {
                blockchain.memoryPool.wipe();
                substractBalance = 64;
                recipientBalance = wallet.currentBalance;
                wallet.createTransaction(senderwallet.publicKey, addBalance);

                blockchain.addBlock(blockchain.memoryPool.transactions);
            });

            describe('and the sender sends another transaction to the recipient', () => {
                beforeEach(() => {
                    blockchain.memoryPool.wipe();
                    senderwallet.createTransaction(wallet.publicKey,addBalance);

                    blockchain.addBlock(blockchain.memoryPool.transactions);
                });

                it('calculate the recipient balance only usign txs since its most recent one',()=>{
                    expect(wallet.currentBalance).toEqual(recipientBalance-substractBalance + addBalance);
                });
            });
        });
    });
});