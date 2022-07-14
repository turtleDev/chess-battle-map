import React from "react";
import { Ranks, Files } from './coordinates'
import { isBlack } from "./piece";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChessPawn,
    faChessKnight,
    faChessBishop, 
    faChessRook,
    faChessQueen, 
    faChessKing
} from "@fortawesome/free-solid-svg-icons";

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
            const square = `${file}${rank}`;
            const piece = this.props.state[square]?.piece;
            const pieceIcon = this.getPieceIcon(piece);
            const overlayStyle = this.getOverlayStyle(this.props.state[square]?.controlledBy)
            return (
                <div key={file} className={`file ${file}`}>
                    <div className={`square ${cls}`}>
                        <div className="control-overlay" style={overlayStyle}></div>
                        <div className="piece">
                            { pieceIcon }
                        </div>
                    </div>
                </div>
            );
        });
    }
    getPieceIcon(piece) {
        if(!piece) {
            return null;
        }
        let icon = null;
        switch(piece.toLowerCase()) {
            case 'p':
                icon = faChessPawn;
                break;
            case 'n':
                icon = faChessKnight;
                break;
            case 'r':
                icon = faChessRook;
                break;
            case 'b':
                icon = faChessBishop;
                break;
            case 'q':
                icon = faChessQueen;
                break;
            case 'k':
                icon = faChessKing;
                break;
            default:
                return null;
        }
        const color = isBlack(piece)?"darkslategrey":"whitesmoke";
        return <FontAwesomeIcon icon={icon} color={color} size="2x"/>
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