# Changelog

All notable changes to this package. Versions follow [semantic versioning](https://semver.org/).

## 1.0.1

### Added

- `slide(board, direction)` Added error handling for invalid move directions.

### Changed

- `move`,`slide`, `canMove`now throw a TypeError when given an unknown direction.

## 1.0.0

First release.

- `move(board, direction)` slides and merges tiles.
- `spawn(board, rng?)` adds a 2 or 4 to a random empty cell.
- `hasMoves(board)` reports whether the game can continue.
- `canMove(board, direction)` reports whether a single direction is a legal move. This replaces the `score` function from the original assignment brief.
- `createBoard(size)` helper, plus TypeScript types.
