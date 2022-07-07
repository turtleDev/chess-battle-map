import { Chess } from 'chess.js';

const flatten = values => [].concat.apply([], values);

class Engine {
    constructor(pgn) {
        let chess = new Chess();
        if(!chess.load_pgn(pgn)) {
            throw Error("invalid pgn")
        }
        this._chess = chess;
        this._history = this._chess.history();
        this._chess.reset();
    }
    state() {
        let board = {};
        flatten(this._chess.board()).forEach(sq => {
            if (!sq) {
                return;
            }
            let piece = sq.type;
            if (sq.color === "w") {
                piece = sq.type.toUpperCase();
            }
            board[sq.square] = piece;
        });
        return board;
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

export default Engine;