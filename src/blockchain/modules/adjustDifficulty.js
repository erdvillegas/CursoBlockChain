const MINE_RATE = 3000;

/**
 * Ajusta dinamicamente la dificultad
 */
export default (previousBlock, timeStamp) => {
    const { difficulty } = previousBlock;

    return previousBlock.timestamp + MINE_RATE > timeStamp 
    ? difficulty + 1 
    : difficulty -1;
};