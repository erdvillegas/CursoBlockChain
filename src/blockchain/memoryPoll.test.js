import MemoryPool from './memoryPoll';
import Wallet, { Transaction } from '../wallet';


describe('MemoryPool', () => {
    let memoryPoll;
    let wallet;
    let transaction;

    beforeEach(() => {
        memoryPoll = new MemoryPool();
        wallet = new Wallet();
        transaction = Transaction.create(wallet, 'h3l0-w0R1D', 5);
        memoryPoll.addOrUpdate(transaction);
    });

    it('has one transaction', () => {
        expect(memoryPoll.transactions.length).toEqual(1);
    });

    it('has a transaction to the memoryPoll', () => {
        const found = memoryPoll.transactions.find(({ id }) => id === transaction.id);
        expect(found).toEqual(transaction);
    });

    it('updates a transaction in the memoryPoll', () => {
        const txOld = JSON.stringify(wallet, '');
        const txNew = transaction.update(wallet, "4d105-Mu4do", 10);
        memoryPoll.addOrUpdate(transaction);

        expect(memoryPoll.transactions.length).toEqual(1);

        const found = memoryPoll.transactions.find(({ id }) => id === transaction.id);
        expect(JSON.stringify(found)).not.toEqual(txOld);
        expect(txNew).toEqual(found);
    });

    it('wipe transactions', () => {
        memoryPoll.wipe();
        expect(memoryPoll.transactions.length).toEqual(0);
    });
});