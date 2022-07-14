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
        getControlledSquares(sq, piece, src).forEach(controlledSquare => {
            board[controlledSquare].controlledBy[sq] = piece;
        })
    })
    return board;
}


function getControlledSquares(square, piece, board) {
    // [[file rank], ...]
    let offsets;

    switch (piece.toLowerCase()) {
        case 'p':
            offsets = getPawnControlledOffsets(piece);
            break;
        case 'n':
            offsets = [
                [-2, 1],
                [-1, 2],
                [1, 2],
                [2, 1],
                [2, -1],
                [1, -2],
                [-1, -2],
                [-2 ,-1]
            ];
            break;
        case 'k':
            offsets = [
                [1, 0],
                [1, 1],
                [0, 1],
                [-1, 1],
                [-1, 0],
                [-1, -1],
                [0, -1],
                [1, -1]
            ];
            break;
        case 'r':
            offsets = getRookControlledOffsets(square, board); 
            break;
        case 'b':
            offsets = getBishopControlledOffsets(square, board);
            break;
        default:
            return [];
    }
    return squaresFromOffsets(square, offsets)
}

function getRookControlledOffsets(square, board) {

    let [fileIdx, rankIdx] = parseCoordinateIdx(square);

    // scan vertically and horizontally in both direction until you hit a piece
    let params = [
        {
            test: offset => fileIdx + offset < Files.length,
            gen: offset => [offset, 0],
        },
        {
            test: offset => fileIdx - offset >= 0,
            gen: offset => [-offset, 0]
        },
        {
            test: offset => rankIdx + offset < Ranks.length,
            gen: offset => [0, offset]
        },
        {
            test: offset => rankIdx - offset >= 0,
            gen: offset => [0, -offset]
        }
    ]

    return offsetGenerator(square, board, params);
}

function getBishopControlledOffsets(square, board) {
    let [fileIdx, rankIdx] = parseCoordinateIdx(square);

    // scan all diagonals until you hit a piece
    let params = [
        // top right
        {
            test: offset => (fileIdx + offset) < Files.length && (rankIdx + offset) < Ranks.length,
            gen: offset => [offset,  offset],
        },
        // bottom right
        {
            test: offset => (fileIdx + offset) < Files.length && (rankIdx - offset) >= 0,
            gen: offset => [offset, -offset]
        },
        // top left
        {
            test: offset => (fileIdx - offset) >= 0 && (rankIdx + offset) < Ranks.length,
            gen: offset => [-offset, offset]
        },
        // bottom left
        {
            test: offset => (fileIdx - offset) >= 0 && (rankIdx - offset) >= 0,
            gen: offset => [ -offset,  -offset]
        }
    ]
    return offsetGenerator(square, board, params);
}

function offsetGenerator(square, board, scans) {
    let offsets = [];
    scans.forEach(scan => {
        for (let i = 1; scan.test(i); i++) {
            let offset = scan.gen(i);
            offsets.push(offset);
            let sq = squareFromOffset(square, offset);
            if (board[sq].piece) {
                return;
            }
        }
    })
    return offsets;
}

function getPawnControlledOffsets(piece) {
    let rankOffset = 1;
    if (isBlack(piece)) {
        rankOffset = -1;
    }
    return [
        [-1, rankOffset],
        [1, rankOffset]
    ];
}

function squareFromOffset(ref, offset) {
    let [fileOffset, rankOffset] = offset;
    let [fileIdx, rankIdx] = parseCoordinateIdx(ref);

    const file = Files[fileIdx + fileOffset];
    const rank = Ranks[rankIdx + rankOffset];

    if (!(file && rank)) {
        return null;
    }
    return `${file}${rank}`
}

// generate a list of squares attacked from {square}
// offsets define which squares are attacked. {offsets} are of the form [[fileOffset, rankOffset],...]
function squaresFromOffsets(refSquare, offsets) {
    return offsets
        .map(offset => squareFromOffset(refSquare, offset))
        .filter(v => !!v);
}

function parseCoordinateIdx(square) {
    const parts = square.trim().split('');
    if (parts.length !== 2) {
        throw Error(`invalid coordinate: ${square}`);
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
            };
        });
    });
    return board;
}

export default Engine;