import React from "react";

const ranks = ["1", "2", "3", "4", "5", "6", "7", "8"];
const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

class Board extends React.Component {
    render() {
        return (
            <div className="board">
                {this.renderRanks()}
            </div>
        );
    }
    renderRanks() {
        return ranks.map((rank, rankIdx) => {
            return (
                <div key={rank} className={`rank ${rank}`}>
                    {this.renderFiles(rank, rankIdx)}                         
                </div>

            );
        });
    }
    renderFiles(rank, rankIdx) {
        return files.map((file, fileIdx) => {
            const cls = (rankIdx+fileIdx)%2?"light":"dark";
            const boardKey = `${file}${rank}`;
            return (
                <div key={file} className={`file ${file}`}>
                    <div className={`square ${cls}`}>
                        {this.props.state[boardKey]}
                    </div>
                </div>
            );
        });
    }
}

export default Board;