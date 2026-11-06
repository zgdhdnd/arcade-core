/**
 * Pure game logic for 2048. A board is a square grid of numbers where 0 means
 * "empty". No function changes the board it is given; each one returns a new one.
 */
export type Board = number[][];
export type Direction = 'up' | 'down' | 'left' | 'right';
export type Cell = [row: number, col: number];
/** Where one tile went. `merged` means it joined the tile already at `to`. */
export interface TileMove {
    from: Cell;
    to: Cell;
    merged: boolean;
}
export interface SlideResult {
    board: Board;
    score: number;
    moves: TileMove[];
    changed: boolean;
}
export declare function createBoard(size?: number): Board;
/** Slides the board and also reports the points earned and where each tile went. */
export declare function slide(board: Board, direction: Direction): SlideResult;
/** Slides every tile as far as it can go, merges equal neighbours once each, and returns the new board. */
export declare function move(board: Board, direction: Direction): Board;
/** Returns true if moving in this direction would change the board. */
export declare function canMove(board: Board, direction: Direction): boolean;
/** Returns true if any direction would change the board, and false when the game is over. */
export declare function hasMoves(board: Board): boolean;
/** Puts a 2 (90%) or a 4 (10%) in a random empty cell and returns the new board. */
export declare function spawn(board: Board, rng?: () => number): Board;
/** Creates a repeatable random function (mulberry32): the same seed gives the same numbers. */
export declare function seededRng(seed: number): () => number;
