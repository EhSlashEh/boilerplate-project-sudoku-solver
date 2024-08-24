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
      if (!validation.valid) {
        return res.json({ error: validation.error });        
      }

      // Validate the coordinate format
      const row = coordinate[0];
      const column = coordinate[1];
      if (coordinate.length !== 2 ||
          !/[a-i]/i.test(row) ||
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
      const index = rowIndex * 9 + colIndex;

      // Check if the position is already filled in the puzzle
      if (puzzle[index] !== 0) {
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

      /*
      const { puzzle, coordinate, value } = req.body;

      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      const validateResult = solver.validate(puzzle);
      if (!validateResult.valid) {
        return res.json({ error: validateResult.error });
      }

      const row = coordinate.charCodeAt(0) - 'A'.charCodeAt(0);
      const col = parseInt(coordinate[1]) - 1;

      if (row < 0 || row >= 9 || col < 0 || col >= 9) {
        return res.json({ error: 'Invalid coordinate' });
      }

      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }

      const conflict = [];
      if (!solver.checkRowPlacement(puzzle, row, col, value)) conflict.push('row');
      if (!solver.checkColPlacement(puzzle, row, col, value)) conflict.push('column');
      if (!solver.checkRegionPlacement(puzzle, row, col, value)) conflict.push('region');

      if (conflict.length > 0) {
        return res.json({ valid: false, conflict });
      }

      return res.json({ valid: true });
      */
    
  app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle;

      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      if (!solver.validate(puzzle) !== 'Valid') {
        res.json({ error: solver.validate(puzzle) });
        return;
      }

      const solution = solver.solve(puzzle);
      if (solution.error) {
        return res.json(solution);
      }
      return res.json({ solution });
    });
};
