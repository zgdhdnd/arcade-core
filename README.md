# @zgdhdnd/arcade-core

Pure game logic for **2048**, with no framework and no DOM. Every function takes a board and returns a new one, so it runs the same in Node, in the browser, or inside any UI framework.

It powers the 2048 page of The Arcade, my course site.

## Install

```bash
npm install @zgdhdnd/arcade-core
```

## Use it

```js
import { createBoard, spawn, move, canMove, hasMoves } from '@zgdhdnd/arcade-core';

let board = spawn(spawn(createBoard()));   // a 4×4 board with two starting tiles

if (canMove(board, 'left')) {
  board = move(board, 'left');             // slide and merge
  board = spawn(board);                    // a new 2 or 4 appears
}

if (!hasMoves(board)) console.log('Game over');
```

A board is an array of rows, and `0` means an empty cell:

```js
move([[2, 2, 2, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], 'left');
// → [[4, 4, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
```

## API

| Function | Returns |
| --- | --- |
| `move(board, direction)` | A new board with every tile slid as far as it goes and equal neighbours merged once each. |
| `spawn(board, rng?)` | A new board with a 2 (90%) or 4 (10%) in a random empty cell. `rng` defaults to `Math.random`. |
| `hasMoves(board)` | `true` if any direction would still change the board, `false` when the game is over. |
| `canMove(board, direction)` | `true` if moving in that direction would change the board. |
| `slide(board, direction)` | `{ board, score, moves, changed }`: the new board, points earned from merges, and where each tile went (`{ from, to, merged }`). Useful for scoring and animation. |
| `seededRng(seed)` | A repeatable random function to pass to `spawn`, so the same seed gives the same spawns. |
| `createBoard(size = 4)` | An empty `size × size` board. |

`direction` is one of `'up'`, `'down'`, `'left'` or `'right'`. Types (`Board`, `Direction`, `Cell`, `SlideResult`, `TileMove`) ship with the package.

### Rules it follows

- Merging is once per tile per move: `2 2 2 2` becomes `4 4`, and `4 4 8` becomes `8 8`.
- Tiles closest to the wall merge first: `2 2 2` moved left is `4 2`, moved right is `2 4`.
- Inputs are never changed, and nothing is read from or written to anything outside the arguments.

### Repeatable games

```js
import { seededRng, spawn, createBoard } from '@zgdhdnd/arcade-core';

const rng = seededRng(2048);
const board = spawn(spawn(createBoard(), rng), rng);   // same two tiles every time
```

`spawn` calls `rng` exactly twice when there is room (once for the cell, once for the value) and not at all on a full board.

## Develop

```bash
npm install
npm test        # compiles src/ to dist/ with tsc, then runs node:test against dist/
```

The source is TypeScript in `src/`. Tests import the compiled `dist/` files so they check exactly what gets published.

## Credits

`seededRng` uses mulberry32, a public-domain generator by Tommy Ettinger.

## License

MIT
