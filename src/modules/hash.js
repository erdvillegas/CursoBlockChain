import { SHA256 } from 'crypto-js';

/**
 * Encripta un conjunto de datos y devuelve su hash
 */
export default (data) => SHA256(JSON.stringify(data)).toString();