/**
 * Pure game logic for 2048. A board is a square grid of numbers where 0 means
 * "empty". No function changes the board it is given; each one returns a new one.
 */
export function createBoard(size = 4) {
    return Array.from({ length: size }, () => Array(size).fill(0));
}
/** Lists the cells of one row or column, starting at the wall the tiles slide towards. */
function lineCells(size, direction, line) {
    return Array.from({ length: size }, (_, step) => {
        const back = size - 1 - step;
        const cells = {
            left: [line, step],
            right: [line, back],
            up: [step, line],
            down: [back, line]
        };
        return cells[direction];
    });
}
/** Slides the board and also reports the points earned and where each tile went. */
export function slide(board, direction) {
    /**  version 1.0.1 update, add direction check*/
    if (!['up', 'down', 'left', 'right'].includes(direction)) {
        throw new TypeError(`Unknown direction: ${direction}`);
    }
    const size = board.length;
    const next = createBoard(size);
    const moves = [];
    let score = 0;
    for (let i = 0; i < size; i++) {
        const line = lineCells(size, direction, i);
        let free = 0; // the next empty slot in this line
        let mergeInto = null; // the last tile placed, until it has merged
        for (const from of line) {
            const value = board[from[0]][from[1]];
            if (value === 0)
                continue;
            if (mergeInto && next[mergeInto[0]][mergeInto[1]] === value) {
                next[mergeInto[0]][mergeInto[1]] = value * 2;
                score += value * 2;
                moves.push({ from, to: mergeInto, merged: true });
                mergeInto = null;
            }
            else {
                const to = line[free];
                free += 1;
                next[to[0]][to[1]] = value;
                moves.push({ from, to, merged: false });
                mergeInto = to;
            }
        }
    }
    const changed = next.flat().join() !== board.flat().join();
    return { board: next, score, moves, changed };
}
/** Slides every tile as far as it can go, merges equal neighbours once each, and returns the new board. */
export function move(board, direction) {
    return slide(board, direction).board;
}
/** Returns true if moving in this direction would change the board. */
export function canMove(board, direction) {
    return slide(board, direction).changed;
}
/** Returns true if any direction would change the board, and false when the game is over. */
export function hasMoves(board) {
    const directions = ['up', 'down', 'left', 'right'];
    return directions.some((direction) => canMove(board, direction));
}
/** Puts a 2 (90%) or a 4 (10%) in a random empty cell and returns the new board. */
export function spawn(board, rng = Math.random) {
    const next = board.map((row) => [...row]);
    const empty = [];
    board.forEach((row, r) => {
        row.forEach((value, c) => {
            if (value === 0)
                empty.push([r, c]);
        });
    });
    if (empty.length === 0)
        return next;
    const [r, c] = empty[Math.floor(rng() * empty.length)];
    next[r][c] = rng() < 0.9 ? 2 : 4;
    return next;
}
/** Creates a repeatable random function (mulberry32): the same seed gives the same numbers. */
export function seededRng(seed) {
    let state = seed >>> 0;
    return () => {
        state = (state + 0x6d2b79f5) >>> 0;
        let t = state;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
