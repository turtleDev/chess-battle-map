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

    AUTO_PLAY_DELAY = 1000;

    constructor(props) {
        super(props);
        this.state = {
            src: props?.loaderData?.pgn || '',
            history: null,
            board: {},
            move: null,
            autoPlayId: null,
            showSource: false,
        };
        this._engine = null;
    }
    componentDidMount() {
        this.init(this.state.src);
    }
    componentDidUpdate() {
        this.adjustHistoryScroll()
    }
    adjustHistoryScroll() {
        const history = document.querySelector(".history");
        const move = history.querySelector(".current-move-row")
        if (!move) {
            history.scroll(0, 0);
            return;
        }

        const viewBox = {
            bottom: history.offsetHeight + history.scrollTop,
            top: history.scrollTop,
            right: history.offsetWidth + history.scrollLeft,
            left: history.scrollLeft
        }
        const moveBox = {
            bottom: move.offsetTop + move.offsetHeight,
            top: move.offsetTop,
            right: move.offsetLeft + move.offsetWidth,
            left: move.offsetLeft
        }


        if (moveBox.bottom > viewBox.bottom) {
            history.scrollBy(0, moveBox.bottom - viewBox.bottom);
        }
        if (moveBox.top < viewBox.top) {
            history.scrollBy(0, moveBox.top - viewBox.top);
        }
        if (moveBox.right > viewBox.right) {
            history.scrollBy(moveBox.right - viewBox.right, 0);
        }
        if (moveBox.left < viewBox.left) {
            history.scrollBy(moveBox.left - viewBox.left, 0);
        }

    }
    init(pgn) {
        if (!pgn) {
            return
        }

        let engine;
        try {
            engine = new Engine(pgn);
        } catch (e) {
            console.error(`error parsing game data: ${e}`)
            throw e;
        }
        this.setState(engine.state());
        this._engine = engine;
    }
    handleStart = e => {
        e.preventDefault();
        let pgn = e.target
            .querySelector('textarea[label=gameData]')
            .value
            .trim();

        this.init(pgn);
        window.scrollTo(0, 0);
    }
    handleNext = e => {

        // handleNext is also called from setInterval.
        // in case this is an actual event fired in response to user input,
        // then we wanna disable autoplay.
        if (e) {
            this.stopAutoPlay();
        }
        this.setState(this._engine.next());
        if (this._engine.isGameEnd()) {
            this.stopAutoPlay();
        }
    }
    handlePrev = _ => {
        this.stopAutoPlay();
        this.setState(this._engine.prev());
    }
    handleGotoFirst = _ => {
        this.stopAutoPlay();
        this.setState(this._engine.seek(0));
    }
    handleGotoLast = _ => {
        this.stopAutoPlay();
        this.setState(this._engine.seek(-1));
    }
    stopAutoPlay = _ => {
        let { autoPlayId } = this.state;
        if (autoPlayId) {
            clearInterval(autoPlayId);
            this.setState({ autoPlayId: null });
        }
    }
    toggleAutoPlay = _ => {
        let { autoPlayId } = this.state;
        if (autoPlayId) {
            this.stopAutoPlay();
            return;
        }
        const id = setInterval(this.handleNext, this.AUTO_PLAY_DELAY);
        this.setState({ autoPlayId: id });
    }

    history() {
        if (!this.state.history) {
            return null;
        }

        const getMoveClass = (idx, current) => idx === current ? "current-move" : "";
        const getRowClass = (idx, current) =>
            (idx === current || idx + 1 === current) ? "current-move-row" : "";

        const hist = this.state.history;
        let rows = [];
        for (let i = 0; i < hist.moves.length; i += 2) {
            rows.push(
                <tr className={getRowClass(i, hist.current)} key={i}>
                    <td>{(i / 2) + 1}</td>
                    <td className={getMoveClass(i, hist.current)}>{hist.moves[i]}</td>
                    <td className={getMoveClass(i + 1, hist.current)}>{hist.moves[i + 1]}</td>
                </tr>
            )
        }
        return (
            <div className="history select-none lg:block lg:absolute my-[1rem] lg:top-2rem lg:-right-[11rem] overflow-y-auto w-[calc(100vw-2rem)] lg:w-auto overflow-x-auto lg:overflow-x-hidden lg:h-[32rem]">
                <table>
                    <tbody className="flex lg:table-row-group">
                        {rows}
                    </tbody>
                </table>
            </div>

        );
    }
    gameTitle() {
        const alt = "?????";
        const metadata = this._engine?.headers() ?? {};
        const white = metadata["White"] ?? alt;
        const black = metadata["Black"] ?? alt;
        const date = metadata["Date"] ?? "...."
        return (
            <div className="my-4 text-center">
                <h1 className="text-2xl font-bold">{white} vs {black}</h1>
                <p>{date}</p>
            </div>
        );
    }
    render() {
        const gameDataAvailable = Object.keys(this.state.board).length !== 0;
        const { autoPlayId, showSource } = this.state;
        return (
            <div className="game">
                <div className="game-container relative">
                    {this.gameTitle()}
                    <div className="board-container">
                        <div className="flex flex-col lg:flex-row">
                            <Board state={this.state.board} move={this.state.move} />
                            {this.history()}
                        </div>
                        {gameDataAvailable &&
                            <div className="controls">
                                <FontAwesomeIcon className="hover:cursor-pointer" icon={faBackwardFast} onClick={this.handleGotoFirst} size="2x" />
                                <FontAwesomeIcon className="hover:cursor-pointer" icon={faBackwardStep} onClick={this.handlePrev} size="2x" />
                                <FontAwesomeIcon
                                    className="hover:cursor-pointer"
                                    icon={autoPlayId ? faPause : faPlay}
                                    onClick={this.toggleAutoPlay}
                                    size="2x"
                                />
                                <FontAwesomeIcon className="hover:cursor-pointer" icon={faForwardStep} onClick={this.handleNext} size="2x" />
                                <FontAwesomeIcon className="hover:cursor-pointer" icon={faForwardFast} onClick={this.handleGotoLast} size="2x" />
                            </div>
                        }

                        <button
                            className={"btn my-4 w-full select-none " + (showSource ? "bg-slate-400" : "")}
                            onClick={() => this.setState({ showSource: !showSource })}
                        >
                            view source
                        </button>
                        <div className={showSource ? "" : "hidden"}>
                            <form
                                className="game-data-input"
                                onSubmit={this.handleStart}>
                                <textarea className="border-2 p-2" label="gameData" rows={10} defaultValue={this.state.src}></textarea>
                                <input className="btn" type="submit" label="start"></input>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}



function GameContainer(props) {
    const loaderData = useLoaderData();
    const propsWithData = { ...props, loaderData }
    return <Game {...propsWithData} />
}

export default GameContainer;