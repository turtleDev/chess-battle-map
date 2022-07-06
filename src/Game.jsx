import React from 'react';
import Board from './Board';
import { Chess } from 'chess.js';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            board: {},
        };
    }
    handleSubmit(e) {
        e.preventDefault();
        let pgn = e.target.querySelector('textarea').value.trim();
        let game = new Chess();

        // todo: error checking
        game.load_pgn(pgn);

        let board = {};
        let squares = [].concat.apply([], game.board());
        squares.forEach(sq => {
            if (!sq) {
                return;
            }
            let piece = sq.type;
            if (sq.color === "w") {
                piece = sq.type.toUpperCase();
            }
            board[sq.square] = piece;
        });
        this.setState({board});
    }
    render() {
        return (
            <div className="game">
                <h1 className="title">Chess Battle Map</h1>
                <Board state={this.state.board}/>
                <form 
                    className="controls"
                    onSubmit={e => this.handleSubmit(e)}>
                        <textarea label="gameData" rows={10}></textarea>
                        <input type="submit" label="start"></input>
                </form>
            </div>
        );
    }
}

export default Game;