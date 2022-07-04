import React from "react";

const ranks = ["1", "2", "3", "4", "5", "6", "7", "8"];
const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

class Board extends React.Component {
    // constructor(props) {
    //     super(props);
    //     // TODO: Board State
    //     // this.state = {
    //     //     rows: Array(8).fill(null).map(_ => Array(8).fill(null)),
    //     // };
    // }
    render() {
        return (
            <div className="board">
                {this.renderRanks()}
            </div>
        );
    }
    renderRanks() {
        return ranks.map((val, idx) => {
            return (
                <div key={val} className={`rank ${val}`}>
                    {this.renderFiles(idx)}                         
                </div>

            );
        });
    }
    renderFiles(rankIdx) {
        return files.map((val, idx) => {
            const cls = (rankIdx+idx)%2?"light":"dark";
            return (
                <div key={val} className={`file ${val}`}>
                    <div className={`square ${cls}`}></div>
                </div>
            );
        });
    }
}

export default Board;