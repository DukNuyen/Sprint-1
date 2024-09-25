'use strict'

const EMPTY = ''
const MINE = '💣'
const FLAG = '🚩'
const HINT = '🧙🏼'

var gBoard

//onInit
function onInit(){
    gBoard = buildBoard()
    placeMines(gBoard)
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
}
//console.log('Game initialized');


//buildBoard
function buildBoard(){
    const rows = 4
    const cols = 4
    const board = []

    for(var i = 0; i < rows; i++){
        const row = []
        for(var j = 0; j < cols; j++){
            row.push({
                isMine: false,
                isRevealed: false,
            });
        }
        board.push(row)
    }
    return board;
}
var board = buildBoard()
//console.table(board)

//placeMines
function placeMines(board){
    var minePlaceCount = 0;
    while(minePlaceCount < 2){
        const rowIdx = getRandomInt(0,4)
        const colIdx = getRandomInt(0,4)

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
        for(var j = 0; j < board[i].length; j++){
            var cell;
            if(board[i][j].isMine){
                cell = '💣'
            }else{
                cell = board[i][j].minesAroundCount || '';
            }
            strHTML += '<td>' + cell + '</td>'
        }
        strHTML += '</tr>'
    }
    elBoard.innerHTML = strHTML;
}
console.log(board);


//countNegs
function countNegs(cellI, cellJ,board){
    var cellNegsMinesCount = 0;

    for(var i = cellI-1; i < cellI+1; i++){
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
