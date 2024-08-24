class SudokuSolver {
  validate(puzzleString) {
    if (!puzzleString) {
      return "Required field missing";
    }

    const isValidLength = puzzleString.length === 81;
    if (!isValidLength) {
      return { valid: false, error: 'Expected puzzle to be 81 characters long' };
    }
    if (/[^1-9.]/g.test(puzzleString)) {
      return { valid: false, error: 'Invalid characters in puzzle' };
    }
    return { valid: true };
  }

  letterToNumber(row) {
    const rowMap = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9 };
    return rowMap[row.toUpperCase()] || "none";
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const board = this.sudokuStringToBoard(puzzleString);
    row = this.letterToNumber(row);
    if (board[row - 1][column - 1] !== 0) {
      return false;
    }
    for (let i = 0; i < 9; i++) {
      if (board[row - 1][i] == value) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const board = this.sudokuStringToBoard(puzzleString);
    row = this.letterToNumber(row);
    if (board[row - 1][column - 1] !== 0) {
      return false;
    }
    for (let i = 0; i < 9; i++) {
      if (board[i][column - 1] === value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const board = this.sudokuStringToBoard(puzzleString);
    row = this.letterToNumber(row);
    if (board[row - 1][column - 1] !== 0) {
      return false;
    }

    let startRow = row - (row % 3);
    let startCol = column - (column % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i + startRow][j + startCol] == value) return false;
      }
    }
    return true;
  }

  sudokuStringToBoard(sudokuString) {
    const board = [];
    let row = [];

    for (let i = 0; i < sudokuString.length; i++) {
      const char = sudokuString[i];
      row.push(char === '.' ? 0 : parseInt(char));

      if ((i + 1) % 9 === 0) {
        board.push(row);
        row = [];
      }
    }

    return board;
  }

  solveSudoku(puzzleString) {
    const board = this.sudokuStringToBoard(puzzleString);

    const SIZE = 9;
    const BOX_SIZE = 3;
    const EMPTY = 0;

    function canPlace(board, row, col, num) {
      for (let x = 0; x < SIZE; x++) {
        if (board[row][x] === num || board[x][col] === num) {
          return false;
        }
      }

      const startRow = row - (row % BOX_SIZE);
      const startCol = col - (col % BOX_SIZE);

      for (let i = 0; i < BOX_SIZE; i++) {
        for (let j = 0; j < BOX_SIZE; j++) {
          if (board[i + startRow][j + startCol] === num) {
            return false;
          }
        }
      }
      return true;
    }

    function solve() {
      for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
          if (board[row][col] === EMPTY) {
            for (let num = 1; num <= SIZE; num++) {
              if (canPlace(board, row, col, num)) {
                board[row][col] = num;
                if (solve()) {
                  return true;
                }
                board[row][col] = EMPTY;
              }
            }
            return false;
          }
        }
      }
      return true;
    }
    
    return solve() ? board.flat().join('') : false;
  }
}

module.exports = SudokuSolver;
