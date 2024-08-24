class SudokuSolver {
  validate(puzzleString) {
    if (!puzzleString) {
      return "Required field missing";
    }
    if (puzzleString.length !== 81) {
      return 'Expected puzzle to be 81 characters long';
    }
    if (/[^1-9.]/g.test(puzzleString)) {
      return 'Invalid characters in puzzle';
    }
    return "Valid";
  }

  letterToNumber(row) {
    switch (row.toUpperCase()) {
      case "A":
        return 1;
      case "B":
        return 2;
      case "C":
        return 3;
      case "D":
        return 4;
      case "E":
        return 5;
      case "F":
        return 6;
      case "G":
        return 7;
      case "H":
        return 8;
      case "I":
        return 9;
      default:
        return "none";
    }
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const board = this.sudokuStringToArray(puzzleString);
    row = thise.letterToNumber(row);
    if (grid[row -1][column - 1] !== 0) {
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
    const board = this.sudokuStringToArray(puzzleString);
    row = this.letterToNumber(row);
    if (grid[row -1][column - 1] !== 0) {
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
    const board = this.sudokuStringToArray(puzzleString);
    row = this.letterToNumber(row);
    if (grid[row - 1][col - 1] !== 0) {
      return false;
    }

    let startRow = row - (row % 3);
    let startCol = col - (col % 3);
    for (let i = 0; i <3; i++)
      for (let j; j < 3; j++)
        if (board[i + startRow][j + startCol] == value) return false;
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
