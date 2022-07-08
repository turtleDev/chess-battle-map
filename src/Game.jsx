import React from 'react';
import Board from './Board';
import Engine from './engine';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            board: {},
            autoPlayId: null,
        };
        this._engine = null;
    }
    handleNext = _ => {
        this.setState({board: this._engine.next()});
    }
    handlePrev = _ => {
        this.setState({board: this._engine.prev()})
    }
    handleStart = e => {
        e.preventDefault();
        let pgn = e.target
            .querySelector('textarea[label=gameData]')
            .value
            .trim();
        
        let engine;
        try {
            engine = new Engine(pgn);
        } catch(e) {
            console.error(`error parsing game data: ${e}`)
        }
        this.setState({board: engine.state()});
        this._engine = engine;
    }
    toggleAutoPlay = _ => {
        if ( this.state.autoPlayId ) {
            clearInterval(this.state.autoPlayId);
            this.setState({autoPlayId: null});
            return;
        }
        let id = setInterval(this.handleNext, 1000);
        this.setState({autoPlayId: id});
    }
    render() {
        const gameDataAvailable = Object.keys(this.state.board).length !== 0;
        return (
            <div className="game">
                <h1 className="title">Chess Battle Map</h1>
                <Board state={this.state.board}/>
                <form 
                    className="controls"
                    onSubmit={this.handleStart}>
                        <textarea label="gameData" rows={10}></textarea>
                        <input type="submit" label="start"></input>
                </form>
                {gameDataAvailable &&
                    <div>
                        <button onClick={this.handlePrev}>previous</button>
                        <button onClick={this.handleNext}>next</button>
                        <button onClick={this.toggleAutoPlay}>
                            { this.state.autoPlayId ? 'pause': 'play'
                            }
                        </button>
                    </div>
                }
            </div>
        );
    }
}

export default Game;