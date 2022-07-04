import React from 'react';
import Board from './Board';

class Game extends React.Component {
    render() {
        return (
            <div className='game'>
                <h1 className='title'>Chess Battle Map</h1>
                <Board/>
            </div>
        );
    }
}

export default Game;