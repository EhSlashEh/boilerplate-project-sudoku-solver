'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      if (!puzzle || !coordinate || !value) {
        return res.json({ error: "Required field(s) missing" });
      }

      const validation = solver.validate(puzzle);
      if (validation !== "Valid") {
        return res.json({ error: validation });
      }

      // Validate the coordinate format
      const row = coordinate[0];
      const column = coordinate[1];
      if (coordinate.length !== 2 ||
          !/[A-I]/i.test(row) ||
          !/[1-9]/.test(column)) {
        return res.json({ error: "Invalid coordinate" });
      }
      
      // Validate the value format
      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: "Invalid value" });
      }

      // Convert coordinate to index
      const rowIndex = solver.letterToNumber(row) - 1;
      const colIndex = +column - 1;

      // Check if the position is already filled in the puzzle
      const board = solver.sudokuStringToBoard(puzzle);
      if (board[rowIndex][colIndex] !== 0) {
        return res.json({ valid: false, error: "Position already filled" });
      }

      // Validate placement
      const validCol = solver.checkColPlacement(puzzle, rowIndex, colIndex, value);
      const validReg = solver.checkRegionPlacement(puzzle, rowIndex, colIndex, value);
      const validRow = solver.checkRowPlacement(puzzle, rowIndex, colIndex, value);

      let conflicts = [];
      if (validCol && validReg && validRow) {
         res.json({ valid: true });
      } else {
        if (!validRow) conflicts.push("row");
        if (!validCol) conflicts.push("column");
        if (!validReg) conflicts.push("region");
        res.json({ valid: false, conflict: conflicts });
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle;

      const validation = solver.validate(puzzle);
      if (validation !== "Valid") {
        return res.json({ error: validation });
      }

      const solvedString = solver.solveSudoku(puzzle);
      if (!solvedString) {
        return res.json({ error: "Puzzle cannot be solved" });
      } else {
        res.json({ solution: solvedString });
      }
    });
};
