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
        test('Nc3', () => {
            const c = new ChessJS.Chess();
            c.move('Nc3');
            const engine = new Engine(c.pgn());
            engine.next();
            const board = engine.state();
            expect(board['c3'].piece).toEqual('N');
            let controlledSquares = [
                'a4', 'b5', 'd5', 'e4', 'e2', 'd1', 'b1', 'a2'
            ]
            controlledSquares.forEach(sq => {
                expect(board[sq].controlledBy).toEqual(
                    expect.objectContaining({'c3': 'N'})
                )
            })
        })
        test("king's adjacent squares", () => {
            let c = new ChessJS.Chess();
            c.move('e4');
            const engine = new Engine(c.pgn());
            const board = engine.state();
            
            // white king
            let controlledSquares = [
                'd1', 'd2', 'e2', 'f2', 'f1'
            ];
            controlledSquares.forEach(sq => {
                expect(board[sq].controlledBy).toEqual(
                    expect.objectContaining({'e1': 'K'})
                )
            });

            // black king
            controlledSquares = [
                'd8', 'd7', 'e7', 'f7', 'f8'
            ];
            controlledSquares.forEach(sq => {
                expect(board[sq].controlledBy).toEqual(
                    expect.objectContaining({'e8': 'k'})
                )
            });
        })

        test('rook (a4)', () => {
            const c = new ChessJS.Chess();
            c.move('a4');
            const engine = new Engine(c.pgn());
            engine.next();
            const board = engine.state();
            expect(board['a4'].piece).toEqual('P');
            expect(board['a5'].controlledBy).toEqual({});
            let controlledSquares = ['a2', 'a3', 'a4', 'b1'];
            controlledSquares.forEach(sq => {
                expect(board[sq].controlledBy).toEqual(
                    expect.objectContaining({'a1': 'R'})
                );
            });
            let uncontrolledSquare = 'a5'
            expect(board[uncontrolledSquare].controlledBy).toEqual({});
        })
    })
})