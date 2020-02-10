import PKG from './package.json';
import Block from './blockchain/block';

const { name, version } = PKG;
const { genesis } = Block;

console.log(`Nombre: ${name} - Version ${version}`);

const block = new Block(Date.now().toString(), 'previous-has', 'hash', 'data');
console.log(block.toString());

console.log('Bloque genesis:', genesis);

const block_1 = new Block(Date.now(), genesis.hash, 'h4sh-1', 'data-1');
const block_2 = new Block(Date.now(), block_1.hash, 'h4sh2', 'data-2');

console.log('Bloque 2: ', block_1.toString());
console.log('Bloque 2: ', block_2.toString());