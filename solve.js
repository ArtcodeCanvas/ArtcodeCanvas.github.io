// const data = require('fs')
//   .readFileSync('/devdin')
//   .toString('utf8')
//   .trim()

// const data = `8 0 0 0 0 0 0 0 0 
// 0 0 3 6 0 0 0 0 0 
// 0 7 0 0 9 0 2 0 0 
// 0 5 0 0 0 7 0 0 0 
// 0 0 0 0 4 5 7 0 0 
// 0 0 0 1 0 0 0 3 0 
// 0 0 1 0 0 0 0 6 8 
// 0 0 8 5 0 0 0 1 0 
// 0 9 0 0 0 0 4 0 0`;

sudoku = function(puzzle) {
  console.time("sudoku_solve");
  // build structure
  var cells = Array(81), rows = Array(9), cols = Array(9), grids = Array(9);

  for ( var i = 0; i < 9; i++) {
    rows[i] = [];
    cols[i] = [];
    grids[i] = [];
  }

  for ( var row = 0; row < 9; row++) {
    for ( var col = 0; col < 9; col++) {
      var grid = row - row % 3 + col / 3 << 0;
      var cell = cells[row * 9 + col] = {
        row : row,
        col : col,
        grid : grid,
        value : puzzle[row][col]
      };
      rows[row].push(cell);
      cols[col].push(cell);
      grids[grid].push(cell);
    }
  }

  cells.forEach(function(cell) {
    var arr = cell.groups = [ cell ];
    rows[cell.row].concat(cols[cell.col]).concat(grids[cell.grid]).forEach(function(obj) {
      if (arr.indexOf(obj) === -1) {
        arr.push(obj);
      }
    });
    arr.shift();
  });
  var results = [];

  function solve(n) {
    if (n === 81) { // solved
      var result = cells.map(function(cell) {
        return cell.value;
      })
      return result;
    }
    var cell = cells[n];
    if (cell.value) {
      let res = solve(n + 1);
      if (res) return res;
    } else {
      for ( var i = 1; i <= 9; i++) {
        if (cell.groups.some(function(obj) {
          return obj.value === i;
        })) {
          continue;
        }
        cell.value = i;
        let res = solve(n + 1);
        if (res) return res;
      }
      cell.value = 0;
    }
    return false;
  }
  let ans = [[],[],[],[],[],[],[],[],[]]
  let x = solve(0);
  x.forEach((f, i) => {
    ans[Math.floor(i/9)].push(f)
  })
  return ans;
}

// console.log(sudoku([
//   [5,3,0,0,7,0,0,0,0],
//   [6,0,0,1,9,5,0,0,0],
//   [0,9,8,0,0,0,0,6,0],
//   [8,0,0,0,6,0,0,0,3],
//   [4,0,0,8,0,3,0,0,1],
//   [7,0,0,0,2,0,0,0,6],
//   [0,6,0,0,0,0,2,8,0],
//   [0,0,0,4,1,9,0,0,5],
//   [0,0,0,0,8,0,0,7,9]]))

// var solution = [
//   [5,3,4,6,7,8,9,1,2],
//   [6,7,2,1,9,5,3,4,8],
//   [1,9,8,3,4,2,5,6,7],
//   [8,5,9,7,6,1,4,2,3],
//   [4,2,6,8,5,3,7,9,1],
//   [7,1,3,9,2,4,8,5,6],
//   [9,6,1,5,3,7,2,8,4],
//   [2,8,7,4,1,9,6,3,5],
//   [3,4,5,2,8,6,1,7,9]]

const input = data.split('\n').map(x => x.split(' ').map(x => parseInt(x, 10)));
const output = sudoku(input).map(x => x.map(y => y.toString(10)).join(' ')).join('\n');
console.log(output);



process.exit();
