class SudokuSolver {
  validate(puzzleString) {
    if (!puzzleString) {
      return "Required field missing";
    }
    if (/[^1-9.]/.test(puzzleString)) {
      return { valid: false, error: 'Invalid characters in puzzle' };
    }

    if (puzzleString.length !== 81) {
      return { valid: false, error: 'Expected puzzle to be 81 characters long' };
    }

    return { valid: true };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const board = this.sudokuStringToArray(puzzleString);
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === parseInt(value)) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const board = this.sudokuStringToArray(puzzleString);
    for (let r = 0; r < 9; r++) {
      if (board[r][column] === parseInt(value)) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const board = this.sudokuStringToArray(puzzleString);
    const regionRowStart = Math.floor(row / 3) * 3;
    const regionColStart = Math.floor(column / 3) * 3;

    for (let r = regionRowStart; r < regionRowStart + 3; r++) {
      for (let c = regionColStart; c < regionColStart + 3; c++) {
        if (board[r][c] === parseInt(value)) {
          return false;
        }
      }
    }
    return true;
  }

  sudokuStringToArray(sudokuString) {
    const board = [];
    let row = [];

    for (let i = 0; i < sudokuString.length; i++) {
      const char = sudokuString[i];

      if (char === '.') {
        row.push(0);
      } else {
        row.push(parseInt(char));
      }

      if ((i + 1) % 9 === 0) {
        board.push(row);
        row = [];
      }
    }

    return board;
  }

  solve(puzzleString) {
    const board = this.sudokuStringToArray(puzzleString);
  
    const isValid = (board, row, col, num) => {
      const newPuzzleString = board.flat().join('');
      return this.checkRowPlacement(newPuzzleString, row, col, num) &&
             this.checkColPlacement(newPuzzleString, row, col, num) &&
             this.checkRegionPlacement(newPuzzleString, row, col, num);
    };
  
    const backtrack = (board) => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (board[row][col] === 0) {
            for (let num = 1; num <= 9; num++) {
              if (isValid(board, row, col, num)) {
                board[row][col] = num;
                if (backtrack(board)) {
                  return true;
                }
                board[row][col] = 0;
              }
            }
            return false;
          }
        }
      }
      return true;
    };
  
    const solved = backtrack(board);
    if (solved) {
      return board.flat().join('');
    } else {
      return { error: 'Puzzle cannot be solved' };
    }
  }
}

module.exports = SudokuSolver;
