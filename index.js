import PKG from './package.json';
import Block from './blockchain/block';

const { name, version } = PKG;
const { genesis } = Block;

console.log('Bloque genesis:', genesis);

const bloque1 = Block.mine(genesis, 'd4t4-1');
console.log(bloque1.toString());

const bloque2 = Block.mine(bloque1, 'd4t4-2');
console.log(bloque2.toString());