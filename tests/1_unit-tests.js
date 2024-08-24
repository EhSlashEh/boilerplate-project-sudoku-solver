const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
  
  // Test 1: Logic handles a valid puzzle string of 81 characters
  test('Logic handles a valid puzzle string of 81 characters', () => {
    const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2....6.7...7...8.8..5.....1.45....8.3..2...9';
    const validation = solver.validate(puzzleString);
    assert.isTrue(validation.valid);
  });

  // Test 2: Logic handles a puzzle string with invalid characters (not 1-9 or .)
  test('Logic handles a puzzle string with invalid characters', () => {
    const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2....6.7...7...8.8..5.....1.45....8.3..2...X';
    const validation = solver.validate(puzzleString);
    assert.isFalse(validation.valid);
    assert.equal(validation.error, 'Invalid characters in puzzle');
  });

  // Test 3: Logic handles a puzzle string that is not 81 characters in length
  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2....6.7...7...8.8..5.....1.45....8.3..2..';
    const validation = solver.validate(puzzleString);
    assert.isFalse(validation.valid);
    assert.equal(validation.error, 'Expected puzzle to be 81 characters long');
  });

  // Test 4: Logic handles a valid row placement
  test('Logic handles a valid row placement', () => {
    const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2....6.7...7...8.8..5.....1.45....8.3..2...9';
    const isValid = solver.checkRowPlacement(puzzleString, 0, 1, '3');
    assert.isTrue(isValid);
  });

  // Test 5: Logic handles an invalid row placement
  test('Logic handles an invalid row placement', () => {
    const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2....6.7...7...8.8..5.....1.45....8.3..2...9';
    const isValid = solver.checkRowPlacement(puzzleString, 0, 1, '5');
    assert.isFalse(isValid);
  });

  // Test 6: Logic handles a valid column placement
  test('Logic handles a valid column placement', () => {
    const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2....6.7...7...8.8..5.....1.45....8.3..2...9';
    const isValid = solver.checkColPlacement(puzzleString, 0, 1, '3');
    assert.isTrue(isValid);
  });

  // Test 7: Logic handles an invalid column placement
  test('Logic handles an invalid column placement', () => {
    const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2....6.7...7...8.8..5.....1.45....8.3..2...9';
    const isValid = solver.checkColPlacement(puzzleString, 0, 1, '6');
    assert.isFalse(isValid);
  });

  // Test 8: Logic handles a valid region (3x3 grid) placement
  test('Logic handles a valid region placement', () => {
    const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2....6.7...7...8.8..5.....1.45....8.3..2...9';
    const isValid = solver.checkRegionPlacement(puzzleString, 0, 1, '3');
    assert.isTrue(isValid);
  });

  // Test 9: Logic handles an invalid region (3x3 grid) placement
  test('Logic handles an invalid region placement', () => {
    const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2....6.7...7...8.8..5.....1.45....8.3..2...9';
    const isValid = solver.checkRegionPlacement(puzzleString, 0, 1, '2');
    assert.isFalse(isValid);
  });

  // Test 10: Valid puzzle strings pass the solver
  test('Valid puzzle strings pass the solver', () => {
    const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2....6.7...7...8.8..5.....1.45....8.3..2...9';
    const solution = solver.solve(puzzleString);
    assert.isString(solution);
    assert.lengthOf(solution, 81);
  });

  // Test 11: Invalid puzzle strings fail the solver
  test('Invalid puzzle strings fail the solver', () => {
    const puzzleString = '115..2.84..63.12.7.2..5.....9..1....8.2....6.7...7...8.8..5.....1.45....8.3..2...9';
    const solution = solver.solve(puzzleString);
    assert.isObject(solution);
    assert.equal(solution.error, 'Puzzle cannot be solved');
  });

  // Test 12: Solver returns the expected solution for an incomplete puzzle
  test('Solver returns the expected solution for an incomplete puzzle', () => {
    const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2....6.7...7...8.8..5.....1.45....8.3..2...9';
    const expectedSolution = '135792684946381257728564139693148725812975346574236891287659413351427968469813572';
    const solution = solver.solve(puzzleString);
    assert.equal(solution, expectedSolution);
  });

});
