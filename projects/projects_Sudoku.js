// projects.js

document.addEventListener('DOMContentLoaded', function () {
    generateSudokuBoard();
    initEditor();
});

let editor;
let delay = 50; // 将时间间隔设置为0.2秒
let currentCell = null;

function initEditor() {
    editor = ace.edit("codeEditor");
    const theme = "monokai";
    const language = "javascript";
    editor.setTheme("ace/theme/" + theme);
    editor.session.setMode("ace/mode/" + language);
    editor.setFontSize(15);
    editor.setReadOnly(false);
    editor.setOption("wrap", "free");
    ace.require("ace/ext/language_tools");
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });
    editor.setValue('', -1);
}

function generateSudokuBoard() {
    const board = document.getElementById('sudokuBoard');
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

    for (let i = 0; i < 9; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('td');
            cell.contentEditable = sampleBoard[i][j] === ".";
            cell.innerText = sampleBoard[i][j] !== "." ? sampleBoard[i][j] : "";
            if (sampleBoard[i][j] !== ".") {
                cell.style.color = 'black'; // 初始化数字为黑色
            }
            row.appendChild(cell);
        }
        board.appendChild(row);
    }
}

function loadExampleCode() {
    fetch('solveSudoku.js')
        .then(response => response.text())
        .then(data => {
            editor.setValue(data, -1);
        });
}

function runSudokuSolver() {
    const board = getBoardValues();
    solveSudoku(board).then(() => setBoardValues(board));
}

function getBoardValues() {
    const board = [];
    const rows = document.getElementById('sudokuBoard').getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        const row = [];
        const cells = rows[i].getElementsByTagName('td');
        for (let j = 0; j < cells.length; j++) {
            row.push(cells[j].innerText || '.');
        }
        board.push(row);
    }
    return board;
}

function setBoardValues(board) {
    const rows = document.getElementById('sudokuBoard').getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        for (let j = 0; j < cells.length; j++) {
            if (board[i][j] !== '.' && cells[j].innerText === '') {
                cells[j].style.color = 'purple'; // 设置确定的数字为紫色
            }
            cells[j].innerText = board[i][j] === '.' ? '' : board[i][j];
        }
    }
}

var solveSudoku = async function(board) {
    async function isValid(row, col, val, board) {
        let len = board.length;

        for (let i = 0; i < len; i++) {
            await highlightCell(row, i, board[row][i] === val ? 'red' : (board[row][i] === '.' ? 'blue' : 'green'));
            if (board[row][i] === val) {
                return false;
            }
        }

        for (let i = 0; i < len; i++) {
            await highlightCell(i, col, board[i][col] === val ? 'red' : (board[i][col] === '.' ? 'blue' : 'green'));
            if (board[i][col] === val) {
                return false;
            }
        }

        let startRow = Math.floor(row / 3) * 3;
        let startCol = Math.floor(col / 3) * 3;

        for (let i = startRow; i < startRow + 3; i++) {
            for (let j = startCol; j < startCol + 3; j++) {
                await highlightCell(i, j, board[i][j] === val ? 'red' : (board[i][j] === '.' ? 'blue' : 'green'));
                if (board[i][j] === val) {
                    return false;
                }
            }
        }

        return true;
    }

    async function backTracking() {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                if (board[i][j] !== '.') continue;
                for (let val = 1; val <= 9; val++) {
                    if (currentCell) currentCell.style.backgroundColor = ''; // 清除之前高亮的格子
                    currentCell = document.getElementById('sudokuBoard').rows[i].cells[j];
                    currentCell.style.backgroundColor = 'yellow';
                    await highlightCell(i, j, 'yellow', `${val}`, 'grey');
                    
                    if (await isValid(i, j, `${val}`, board)) {
                        board[i][j] = `${val}`;
                        await highlightCell(i, j, 'yellow', `${val}`, 'blue');
                        if (await backTracking()) {
                            await highlightCell(i, j, 'yellow', `${val}`, 'purple');
                            return true;
                        }
                        board[i][j] = '.';
                        await highlightCell(i, j, 'yellow', '', 'grey');
                    } else {
                        await highlightCell(i, j, 'yellow', '', 'grey');
                    }
                }
                return false;
            }
        }
        return true;
    }

    await backTracking();
    return board;
};

async function highlightCell(row, col, color, content = null, textColor = 'grey') {
    const cell = document.getElementById('sudokuBoard').rows[row].cells[col];
    cell.style.backgroundColor = color;
    if (content !== null) {
        cell.innerText = content;
        cell.style.color = textColor;
    }
    await new Promise(resolve => setTimeout(resolve, delay));
}
