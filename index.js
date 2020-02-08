import PKG from './package.json';
import Block from './blockchain/block';

const { name, version } = PKG;

console.log(`Nombre: ${name} - Version ${version}`);

const block = new Block(Date.now().toString(), 'previous-has', 'hash', 'data');
console.log(block.toString());