import React from 'react';
import Board from './Board';
import Engine from './engine';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBackwardStep,
    faBackwardFast,
    faForwardStep,
    faForwardFast,
    faPlay,
    faPause,
} from '@fortawesome/free-solid-svg-icons';
import { useLoaderData } from 'react-router-dom';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            board: {},
            autoPlayId: null,
            showSource: false,
        };
        this._engine = null;
        this._autoplayDelay = 1000;
        if (props?.loaderData?.pgn) {
            setTimeout(() => {
                document.querySelector('textarea[label=gameData]').innerHTML = props.loaderData.pgn;
                document.querySelector('form.game-data-input > input[type=submit]').click();
            }, 0);
        }
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
            throw e;
        }
        this.setState({board: engine.state()});
        this._engine = engine;
    }
    handleNext = e => {

        // handleNext is also called from setInterval.
        // in case this is an actual event fired in response to user input,
        // then we wanna disable autoplay.
        if (e) {
            this.stopAutoPlay();
        }
        this.setState({board: this._engine.next()});
        if (this._engine.isGameEnd()) {
            this.stopAutoPlay();
        }
    }
    handlePrev = _ => {
        this.stopAutoPlay();
        this.setState({board: this._engine.prev()});
    }
    handleGotoFirst = _ => {
        this.stopAutoPlay();
        this.setState({board: this._engine.seek(0)});
    }
    handleGotoLast = _ => {
        this.stopAutoPlay();
        this.setState({board: this._engine.seek(-1)});
    }
    stopAutoPlay = _ => {
        let { autoPlayId } = this.state;
        if ( autoPlayId ) {
            clearInterval(autoPlayId);
            this.setState({autoPlayId: null});
        }
    }
    toggleAutoPlay = _ => {
        let { autoPlayId } = this.state;
        if ( autoPlayId ) {
            this.stopAutoPlay();
            return;
        }
        const id = setInterval(this.handleNext, this._autoplayDelay);
        this.setState({autoPlayId: id});
    }
    history() {
        if (!this._engine) {
            return null;
        }
        const hist = this._engine.history();
        let rows = [];
        for ( let i = 0; i < hist.moves.length; i += 2) {
            rows.push(
                <tr key={i}>
                    <td>{(i/2) + 1}</td>
                    <td className={getRowClass(i, hist.current)}>{hist.moves[i]}</td>
                    <td className={getRowClass(i+1, hist.current)}>{hist.moves[i+1]}</td>
                </tr>
            )
        }
        return rows;
    }
    render() {
        const gameDataAvailable = Object.keys(this.state.board).length !== 0;
        const { autoPlayId, showSource } = this.state;
        return (
            <div className="game mt-10">
                <div className="game-container relative">
                    <div className="board-container">
                        <Board state={this.state.board}/>
                        {gameDataAvailable &&
                            <div className="controls">
                                <FontAwesomeIcon className="hover:cursor-pointer" icon={faBackwardFast} onClick={this.handleGotoFirst} size="2x"/>
                                <FontAwesomeIcon className="hover:cursor-pointer" icon={faBackwardStep} onClick={this.handlePrev} size="2x"/>
                                <FontAwesomeIcon
                                    className="hover:cursor-pointer" 
                                    icon={autoPlayId?faPause:faPlay} 
                                    onClick={this.toggleAutoPlay}
                                    size="2x"
                                />
                                <FontAwesomeIcon className="hover:cursor-pointer" icon={faForwardStep} onClick={this.handleNext} size="2x"/>
                                <FontAwesomeIcon className="hover:cursor-pointer" icon={faForwardFast} onClick={this.handleGotoLast} size="2x"/>
                            </div>
                        }

                        <button 
                            className={"btn my-4 w-full " + (showSource?"bg-slate-400":"")}
                            onClick={() => this.setState({showSource: !showSource})}
                        >
                            view source
                        </button>
                        <div className={showSource?"":"hidden"}>
                            <form 
                                className="game-data-input"
                                onSubmit={this.handleStart}>
                                    <textarea className="border-2 p-2" label="gameData" rows={10}></textarea>
                                    <input className="btn" type="submit" label="start"></input>
                            </form>
                        </div>

                    </div>
                    <div className="history hidden lg:block absolute top-0 -right-[11rem]">
                        <table>
                            <tbody>
                                {this.history()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}


function getRowClass(idx, current) {
    if (idx === current) {
        return "current-move";
    }
    return "";
}

function GameContainer(props) {
    const loaderData = useLoaderData();
    const propsWithData = {...props, loaderData}
    return <Game {...propsWithData}/>
}

export default GameContainer;