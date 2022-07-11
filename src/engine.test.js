const Engine = require('./engine').default;
const ChessJS = require('chess.js');

describe('engine', () => {
    test('should throw an exception if gamedata is empty', () => {
        expect(() => new Engine('')).toThrow(new Error('invalid pgn'));
    })
    describe('square control', () => {
        test('e4', () => {
            const c = new ChessJS.Chess();
            c.move('e4');
            const engine = new Engine(c.pgn());
            engine.next();
            const board = engine.state();
            expect(board['e4'].piece).toEqual('P');
            expect(board['d5'].controlledBy).toEqual({'e4': 'P'});
            expect(board['f5'].controlledBy).toEqual({'e4': 'P' });
        })
        test('a3', () => {
            const c = new ChessJS.Chess();
            c.move('a3');
            const engine = new Engine(c.pgn());
            engine.next();
            const board = engine.state();
            expect(board['a3'].piece).toEqual('P');
            expect(board['b4'].controlledBy).toEqual({'a3': 'P'});
        })
    })
})