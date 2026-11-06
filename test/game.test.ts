import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { canMove, createBoard, hasMoves, move, seededRng, slide, spawn } from '../dist/index.js';

// Tests run against the compiled output, the same files npm users get.

const empty = [0, 0, 0, 0];
/** A board with `row` on top and nothing below it. */
const topRow = (row: number[]) => [row, empty, empty, empty];

const stuck = [
	[2, 4, 2, 4],
	[4, 2, 4, 2],
	[2, 4, 2, 4],
	[4, 2, 4, 2]
];

describe('move', () => {
	it('slides tiles to the edge', () => {
		assert.deepEqual(move(topRow([0, 2, 0, 4]), 'left')[0], [2, 4, 0, 0]);
	});

	it('merges each tile at most once', () => {
		assert.deepEqual(move(topRow([2, 2, 2, 2]), 'left')[0], [4, 4, 0, 0]);
		assert.deepEqual(move(topRow([4, 4, 8, 0]), 'left')[0], [8, 8, 0, 0]);
		assert.deepEqual(move(topRow([2, 2, 2, 0]), 'left')[0], [4, 2, 0, 0]);
	});

	it('merges from the edge the tiles move towards', () => {
		assert.deepEqual(move(topRow([2, 2, 2, 0]), 'right')[0], [0, 0, 2, 4]);
	});

	it('handles columns for up and down', () => {
		const board = [
			[2, 0, 0, 0],
			[2, 0, 0, 0],
			[4, 0, 0, 0],
			[4, 0, 0, 0]
		];
		assert.deepEqual(move(board, 'up').map((row) => row[0]), [4, 8, 0, 0]);
		assert.deepEqual(move(board, 'down').map((row) => row[0]), [0, 0, 4, 8]);
	});

	it('does not change its input', () => {
		const board = topRow([2, 2, 0, 0]);
		const copy = structuredClone(board);
		move(board, 'left');
		assert.deepEqual(board, copy);
	});
});

describe('slide', () => {
	// version 1.0.1 added
	it('rejects invalid directions', () => {
    	assert.throws(
        	() => slide(createBoard(), 'sideways' as never),
        	/Unknown direction/
    	);
	});

	it('reports the score from merges', () => {
		assert.equal(slide(topRow([2, 2, 4, 4]), 'left').score, 12);
		assert.equal(slide(topRow([2, 4, 8, 16]), 'left').score, 0);
	});

	it('reports where every tile went', () => {
		assert.deepEqual(slide(topRow([2, 0, 2, 0]), 'left').moves, [
			{ from: [0, 0], to: [0, 0], merged: false },
			{ from: [0, 2], to: [0, 0], merged: true }
		]);
	});
});

describe('canMove and hasMoves', () => {
	it('canMove is false when nothing would change', () => {
		const board = topRow([2, 4, 0, 0]);
		assert.equal(canMove(board, 'left'), false);
		assert.equal(canMove(board, 'up'), false);
		assert.equal(canMove(board, 'right'), true);
		assert.equal(canMove(board, 'down'), true);
	});

	it('canMove is true when only a merge is possible', () => {
		assert.equal(canMove(topRow([2, 2, 4, 8]), 'left'), true);
	});

	it('hasMoves is false on a full board with nothing to merge', () => {
		assert.equal(hasMoves(stuck), false);
	});

	it('hasMoves is true with an empty cell or a possible merge', () => {
		const withGap = structuredClone(stuck);
		withGap[3][3] = 0;
		assert.equal(hasMoves(withGap), true);

		const withPair = structuredClone(stuck);
		withPair[0][1] = 2;
		assert.equal(hasMoves(withPair), true);
	});
});

describe('spawn', () => {
	it('fills exactly one empty cell with a 2 or a 4', () => {
		const tiles = spawn(createBoard()).flat().filter((value) => value !== 0);
		assert.equal(tiles.length, 1);
		assert.ok(tiles[0] === 2 || tiles[0] === 4);
	});

	it('uses the rng for the cell and the value', () => {
		assert.equal(spawn(createBoard(), () => 0)[0][0], 2);
		assert.equal(spawn(createBoard(), () => 0.99)[3][3], 4);
	});

	it('returns an unchanged copy when the board is full', () => {
		const next = spawn(stuck);
		assert.deepEqual(next, stuck);
		assert.notEqual(next, stuck);
	});
});

describe('seededRng', () => {
	it('repeats the same numbers for the same seed', () => {
		const a = seededRng(2048);
		const b = seededRng(2048);
		const first = [a(), a(), a()];
		assert.deepEqual(first, [b(), b(), b()]);
		assert.ok(first.every((n) => n >= 0 && n < 1));
		assert.notEqual(first[0], seededRng(1)());
	});
});
