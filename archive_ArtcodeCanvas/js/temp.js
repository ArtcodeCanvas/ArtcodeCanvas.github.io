
var solveSudoku = function(board) {
    function isValid(row, col, val, board) {
        let len = board.length;
        // 判断行内数字不重复，每隔0.5s才执行一次步长+1，同时使得左边棋盘的对应变色，如果对应的格子没有填数，则变成蓝色，有填数且合法则变成绿色，有填数且不合法变成红色
        for (let i = 0; i < len; i++) {
            if (board[row][i] === val) {
                return false;
            }
        }
        // 判断列内数字不能重复，每隔0.5s才执行一次步长+1，同时使得左边棋盘的对应变色，如果对应的格子没有填数，则变成蓝色，有填数且合法则变成绿色，有填数且不合法变成红色
        for (let i = 0; i < len; i++) {
            if (board[i][col] === val) {
                return false;
            }
        }
        let startRow = Math.floor(row / 3) * 3;
        let startCol = Math.floor(col / 3) * 3;

        //九宫格内不能重复，每隔0.5s才执行一次步长+1，同时使得左边棋盘的对应变色，如果对应的格子没有填数，则变成蓝色，有填数且合法则变成绿色，有填数且不合法变成红色
        for (let i = startRow; i < startRow + 3; i++) {
            for (let j = startCol; j < startCol + 3; j++) {
                if (board[i][j] === val) {
                    return false;
                }
            }
        }

        return true;
    }

    function backTracking() {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                if (board[i][j] !== '.') continue;
                for (let val = 1; val <= 9; val++) {
                    //尝试填写数字，每次填写时将当前格子变成黄色，而且填写的数字应该是深灰色的
                    if (isValid(i, j, `${val}`, board)) {
                        board[i][j] = `${val}`;
                        if (backTracking()) {
                            return true;
                        }
                        board[i][j] = '.';
                    }
                }
                return false;
            }
        }
        return true;
    }

    backTracking();
    return board;
};

const sampleBoard = [
    ["4", "7", "3", "6", "5", "9", ".", ".", "2"],
    ["9", "5", "8", ".", ".", "4", "6", ".", "."],
    ["6", "2", "1", "3", "8", "7", "5", "9", "4"],
    ["2", "1", "6", "9", ".", "5", ".", ".", "."],
    ["8", "9", "4", ".", ".", "2", ".", "6", "5"],
    ["7", "3", "5", "8", "4", "6", ".", ".", "9"],
    ["5", ".", "9", ".", ".", "1", ".", ".", "."],
    ["1", ".", "2", "5", "9", "3", ".", ".", "."],
    ["3", ".", "7", ".", ".", "8", "9", "5", "1"]
];