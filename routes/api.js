'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
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
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      const validateResult = solver.validate(puzzle);
      if (!validateResult.valid) {
        return res.json({ error: validateResult.error });
      }

      const solution = solver.solve(puzzle);
      if (solution.error) {
        return res.json(solution);
      }
      return res.json({ solution });
    });
};
