import React, { useEffect } from "react";
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
            <div className="board-container">
                <div className="board">
                    {this.renderRanks()}
                </div>
                <div className="arena">
                    {this.renderPieces()}
                </div>
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
            const square = `${file}${rank}`;
            const overlayStyle = this.getOverlayStyle(this.props.state[square]?.controlledBy);
            const cls = `square ${square} ${(rankIdx+fileIdx)%2?"light":"dark"}`;
            return (
                <div key={file} className={`file ${file}`}>
                    <div className={cls}>
                        <div className="control-overlay" style={overlayStyle}></div>
                    </div>
                </div>
            );
        });
    }
    componentDidUpdate() {
        for (let [square, {piece}] of Object.entries(this.props.state)) {
            if (!piece) {
                continue;
            }
            const pieceRef = document.querySelector(`.piece.${square}`);
            const squareRef = document.querySelector(`.square.${square}`);

            pieceRef.style.left = `${computeOffsetLeft(squareRef, pieceRef)}px`;
            pieceRef.style.top = `${computeOffsetTop(squareRef, pieceRef)}px`;
        };
    }
    renderPieces() {
        const board = this.props.state;
        const keys = Object.keys(board).sort();

        // todo: stable identity for pieces
        return keys.filter(sq => !!board[sq].piece)
            .map(sq => <div className={`piece ${sq}`}>{this.getPieceIcon(board[sq].piece)}</div>)
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

function computeOffsetLeft(square, piece) {
    return square.offsetLeft + (square.offsetWidth/2) - (piece.offsetWidth/2)
}

function computeOffsetTop(square, piece) {
    return square.offsetTop + (square.offsetHeight/2) - (piece.offsetHeight/2)
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