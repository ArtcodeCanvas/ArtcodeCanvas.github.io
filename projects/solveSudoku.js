var solveSudoku = function (board) {
    function isValid(row, col, val, board) {
        //该函数用于判断在board的第row行第col列填写val是否合法
        let len = board.length
        for (let i = 0; i < len; i++) {
            if (board[row][i] === val) {
                return false      //如果val在这一行已经出现过了，不合法
            }
        }
        for (let i = 0; i < len; i++) {
            if (board[i][col] === val) {
                return false          //如果val在这一行出现过了，不合法
            }
        }
        let startRow = Math.floor(row / 3) * 3
        let startCol = Math.floor(col / 3) * 3        //计算出(row,col)所在小九宫格的左上角的位置
        for (let i = startRow; i < startRow + 3; i++) {
            for (let j = startCol; j < startCol + 3; j++) {
                if (board[i][j] === val) {
                    return false   //如果val在小九宫格出现过了，不合法          
                }
            }
        }
        return true
    }

    function backTracking() {       //利用回溯填写数独
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                if (board[i][j] !== '.')
                    continue   //如果该格不是空格，继续往下填             
                for (let val = 1; val <= 9; val++) {
                    if (isValid(i, j, `${val}`, board)) {
                        board[i][j] = `${val}`//如果在(i,j)填写val合法，就尝试这种填发                    
                        if (backTracking()) {
                            return true//如果尝试成功，就这样填                
                        }
                        board[i][j] = '.'//尝试失败，还原数独               
                    }
                } return false
            }
        } return true
    }
    backTracking(board)
    return board
};
