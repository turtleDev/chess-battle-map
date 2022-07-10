const Engine = require('./engine').default;

test('should throw an exception if gamedata is empty', () => {
    expect(() => new Engine('')).toThrow(new Error('invalid pgn'));
})