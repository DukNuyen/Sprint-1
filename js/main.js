'use strict'

const EMPTY = ''
const MINE = '💥'
const FLAG = '🚩'
const HINT = '🧙🏼'

var gBoard

var gLevel = {
    SIZE : 4,
    MINES : 2
}

//onInit
function onInit(){
    gBoard = buildBoard(gLevel.SIZE);
    placeMines(gBoard, gLevel.MINES);
    setMinesNegsCount(gBoard);
    renderBoard(gBoard);

    document.getElementById('smiley').innerHTML = '😃';
}
//console.log('Game initialized');


//buildBoard
function buildBoard(size){
    const board = []

    for(var i = 0; i < size; i++){
        const row = []
        for(var j = 0; j < size; j++){
            row.push({
                isMine: false,
                isRevealed: false,
                isFlag: false
            });
        }
        board.push(row)
    }
    return board;
}
var board = buildBoard()
//console.table(board)

//placeMines
function placeMines(board, mineCount){
    var minePlaceCount = 0;
    const size = board.length
    while(minePlaceCount < mineCount){
        const rowIdx = getRandomInt(0,size)
        const colIdx = getRandomInt(0,size)

        if(!board[rowIdx][colIdx].isMine){
            board[rowIdx][colIdx].isMine = true
            minePlaceCount++
        }
    }
}
placeMines(board);
console.table(board); 

//renderBoard
function renderBoard(board){
    var elBoard = document.querySelector('.board')
    var strHTML = '';
    
    for(var i = 0; i < board.length; i++){
        strHTML += '<tr>'

        for (var j = 0; j < board[i].length; j++) {
            var cellClass = board[i][j].isRevealed ? 'reveled' : '';
            
            if (board[i][j].isRevealed && board[i][j].isMine) {
                cellClass += ' mine';
            }
            
            var cellContent;
            if(board[i][j].isRevealed){
                cellContent = board[i][j].isMine ? MINE : board[i][j].minesAroundCount || '';
            }else if(board[i][j].isFlag){
                cellContent = FLAG
            }else{
                cellContent = '';
            }
            strHTML += `<td class="${cellClass}" onclick="onCellClicked(${i}, ${j})" oncontextmenu="onCellClickFlag(event, ${i}, ${j})">${cellContent}</td>`;
        }
        strHTML += '</tr>';
    }
    elBoard.innerHTML = strHTML;
}
console.log(board);


//countNegs
function countNegs(cellI, cellJ,board){
    var cellNegsMinesCount = 0;

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if(i < 0 || i >= board.length) continue;

        for(var j = cellJ -1; j <= cellJ + 1; j++){
            if(j < 0 || j >= board[i].length) continue;

            if(i === cellI && j === cellJ) continue; //עצמו

            if(board[i][j].isMine === true)cellNegsMinesCount++;
        }
    }
    //console.log(`Cell(${cellI},${cellJ}) has ${cellNegsMinesCount} mines around.`);
    return cellNegsMinesCount;
}

//setMinesNegsCount
function setMinesNegsCount(board){
    for(var i = 0; i < board.length; i++){
        for(var j = 0; j < board[i].length; j++){
            var neighborMinesCount = countNegs(i,j,board)
            board[i][j].minesAroundCount = neighborMinesCount;
        }
    }
}

//onCellClicked
function onCellClicked(i,j){
    var cell = gBoard[i][j]

    if(cell.isRevealed)return //כלום

    if(cell.isMine){
        showAllMines(gBoard)
        document.getElementById('smiley').innerHTML = '💀';
        console.log('Mine triggerd! Game over!')
    }else{
        cell.isRevealed = true
        console.log(`cell ${i},${j}, Mines around: ${cell.minesAroundCount}`)
        victoryChack(gBoard)
    }
    renderBoard(gBoard)
}

//showAllMines
function showAllMines(board){
    for(var i = 0; i < board.length; i++){
        for(var j = 0; j < board[i].length; j++) {
            if(board[i][j].isMine) {
                board[i][j].isRevealed = true;
            }
        }        
    }
}

//onCellClickFlag
function onCellClickFlag(event, i, j){

    event.preventDefault()

    var cell = gBoard[i][j]
    if(cell.isRevealed) return

    cell.isFlag = !cell.isFlag

    renderBoard(gBoard);

}
//victoryChack
function victoryChack(board){
    var allMinesFlagged = true;
    var allSafeCellsRevealed = true;

    for(var i = 0; i < board.length; i++){
        for(var j = 0; j < board[i].length; j++){
            var cell = board[i][j];
            if(cell.isMine && !cell.isFlag){
                allMinesFlagged = false;
            }
            if(!cell.isMine && !cell.isRevealed){
                allSafeCellsRevealed = false;
            }
        }
    }

    if(allMinesFlagged && allSafeCellsRevealed) {
        document.getElementById('smiley').innerHTML = '😎';
        alert("Siuuuuuuu you won!🏆🍾");
    }
}

//setLevel
function setLevel(size, mines){
    gLevel.SIZE = size;
    gLevel.MINES = mines;
    onInit();
}