import React from "react";
import { Ranks, Files } from './coordinates'
import { isBlack } from "./piece";

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
            const overlayStyle = this.getOverlayStyle(this.props.state[boardKey]?.controlledBy)
            return (
                <div key={file} className={`file ${file}`}>
                    <div className={`square ${cls}`}>
                        <div className="control-overlay" style={overlayStyle}></div>
                        <div className="piece">
                            {this.props.state[boardKey]?.piece}
                        </div>
                    </div>
                </div>
            );
        });
    }
    getOverlayStyle(controllingPieces) {
        if (!(controllingPieces && Object.keys(controllingPieces).length)) {
            return {}
        }
        let control = 0;
        Object.keys(controllingPieces).forEach(sq => {
            let piece = controllingPieces[sq];
            if (isBlack(piece)) {
                control -= 1;
            } else {
                control += 1;
            }
        })
        if (control > 0) {
            return {backgroundColor: 'RGBA(255, 0, 0, 0.4)'}
        }
        if (control < 0) {
            return {backgroundColor: 'RGBA(0, 255, 255, 0.4)'}
        }
        return {backgroundColor: 'RGBA(128, 128, 128, 0.4' }
    }
}

export default Board;