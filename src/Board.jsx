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
                    <div className={`square ${square} ${cls} w-[calc(calc(100vw-2rem)/8)] h-[calc(calc(100vw-2rem)/8)] md:w-16 md:h-16`}>
                        <div className="control-overlay" style={overlayStyle}></div>
                        <div className="piece">
                            { pieceIcon }
                        </div>
                    </div>
                </div>
            );
        });
    }
    componentDidUpdate() {
        this.animateMove();
    }
    animateMove() {

        if (!this.props.move) {
            return
        }

        const fromSquare = document.querySelector(`.square.${this.props.move.from}`)
        const piece = document.querySelector(`.square.${this.props.move.to} .piece`)

        const originalOffsetTop = piece.offsetTop;
        const originalOffsetLeft = piece.offsetLeft;

        piece.style.left = `${fromSquare.offsetLeft + (fromSquare.offsetWidth/2) - (piece.offsetWidth/2)}px`;
        piece.style.top = `${fromSquare.offsetTop + (fromSquare.offsetHeight/2) - (piece.offsetHeight/2)}px`;

        setTimeout(() => {
            piece.style.transition = `300ms all`;
            piece.style.left = `${originalOffsetLeft}px`;
            piece.style.top = `${originalOffsetTop}px`;
            setTimeout(() => {
                piece.style.transition = 'none';
            }, 300)
        }, 50);
    }
    getPieceIcon(piece) {
        if(!piece) {
            return null;
        }
        const icon = IconMapping[piece.toLowerCase()];
        if (!icon) {
            return null;
        }
        const color = isBlack(piece)?"darkslategrey":"whitesmoke";
        return <FontAwesomeIcon icon={icon} color={color} size="2x"/>;
    }

    // rename this to getSquarePressure ?
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
            return {backgroundColor: `RGBA(255, 0, 0, ${controlIntensity(control)})`};
        }
        if (control < 0) {
            return {backgroundColor: `RGBA(0, 255, 255, ${controlIntensity(control)})`};
        }
        return {backgroundColor: 'RGBA(100, 50, 150, 0.4)'};
    }
}

function controlIntensity(control) {
    const max = 4
    if (control < 0) {
        control *= -1
    }
    if (control > max) {
        control = max;
    }
    control = control / 10;
    return 0.1 + control;
}

const IconMapping = {
    'p': faChessPawn,
    'n': faChessKnight,
    'b': faChessBishop,
    'r': faChessRook,
    'q': faChessQueen,
    'k': faChessKing,
};


export default Board;