import React from "react";
import { Ranks, Files } from './coordinates'

class Board extends React.Component {
    render() {
        return (
            <div className="board">
                {this.renderRanks()}
            </div>
        );
    }
    renderRanks() {
        return Ranks.map((rank, rankIdx) => {
            return (
                <div key={rank} className={`rank ${rank}`}>
                    {this.renderFiles(rank, rankIdx)}                         
                </div>

            );
        });
    }
    renderFiles(rank, rankIdx) {
        return Files.map((file, fileIdx) => {
            const cls = (rankIdx+fileIdx)%2?"light":"dark";
            const boardKey = `${file}${rank}`;
            return (
                <div key={file} className={`file ${file}`}>
                    <div className={`square ${cls}`}>
                        {this.props.state[boardKey]?.piece}
                    </div>
                </div>
            );
        });
    }
}

export default Board;