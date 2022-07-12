import { Chess } from 'chess.js';
import { isBlack } from './piece';
import { Ranks, Files } from './coordinates';

const flatten = values => [].concat.apply([], values);

class Engine {
    constructor(pgn) {
        let chess = new Chess();
        if (!chess.load_pgn(pgn)) {
            throw Error("invalid pgn")
        }
        this._chess = chess;
        this._history = this._chess.history();
        this._chess.reset();
    }
    state() {
        let board = newEmptyBoard();
        flatten(this._chess.board()).forEach(sq => {
            if (!sq) {
                return;
            }
            let piece = sq.type;
            if (sq.color === "w") {
                piece = sq.type.toUpperCase();
            }
            board[sq.square].piece = piece;
        });
        return withSquareControl(board);
    }
    next() {
        let move = this._history.shift();
        if (move) {
            this._chess.move(move);
        }
        return this.state();
    }
    prev() {
        let move = this._chess.undo()?.san;
        if (move) {
            this._history.unshift(move);
        }
        return this.state();
    }
}

function withSquareControl(src) {
    const board = JSON.parse(JSON.stringify(src));
    Object.keys(src).forEach(sq => {
        const piece = src[sq].piece;
        if (!piece) {
            return;
        }
        getControlledSquares(piece, sq).forEach(controlledSquare => {
            board[controlledSquare].controlledBy[sq] = piece;
        })
    })
    return board;
}

function getControlledSquares(piece, square) {
    const controlledSquares = [];
    switch (piece.toLowerCase()) {
        case 'p':
            const fileOffsets = [-1, 1]
            let rankOffset = 1;
            if (isBlack(piece)) {
                rankOffset = -1;
            }
            const [fileIdx, rankIdx] = parseCoordinate(square);
            fileOffsets.forEach(fileOffset => {
                const file = Files[fileIdx + fileOffset];
                const rank = Ranks[rankIdx + rankOffset];

                // check that rank and file are valid
                if (!(rank && file)) {
                    return
                }
                controlledSquares.push(`${file}${rank}`);
            })

            break;
        default:
            console.info(`getControlledSquares: not implemented ${piece}`);
    }
    return controlledSquares;
}

function parseCoordinate(square) {
    const parts = square.trim().split('')
    if (parts.length !== 2) {
        throw Error(`invalid coordinate: ${square}`)
    }
    return [Files.indexOf(parts[0]), parseInt(parts[1]) - 1]
}

function newEmptyBoard() {
    let board = {};
    Files.forEach(file => {
        Ranks.forEach(rank => {
            board[`${file}${rank}`] = {
                piece: null,
                controlledBy: {},
            }
        })
    })
    return board;
}

export default Engine;