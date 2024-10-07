'use strict'

const EMPTY = ''
const MINE = '💥'
const FLAG = '🚩'
const WIN_SOUND = new Audio("sounds/siu.mp3");


var gBoard
var gLevel = {
    SIZE : 4,
    MINES : 2
}
var gFirstMove;
var gLives;
var gGameOver = false


//onInit
function onInit(){
    gBoard = buildBoard(gLevel.SIZE);
    gGameOver = false;
    gFirstMove = true
    gLives = gLevel.SIZE === 4 ? 1 : 3; //easy 1 live
    liveDisplay();
    renderBoard(gBoard);

    document.getElementById('smiley').innerHTML = '😃';
    document.getElementById('win').innerHTML = '';

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
function placeMines(board, mineCount, firstClickCell){
    var minePlaceCount = 0;
    const size = board.length
    while(minePlaceCount < mineCount){
        const rowIdx = getRandomInt(0,size)
        const colIdx = getRandomInt(0,size)

        if((rowIdx === firstClickCell.i && colIdx === firstClickCell.j) || board[rowIdx][colIdx].isMine){
            continue
        }
        board[rowIdx][colIdx].isMine = true
        minePlaceCount++
    }
}
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
    if(gGameOver)return

    var cell = gBoard[i][j]

    if(cell.isRevealed)return //כלום

    if(gFirstMove){
        placeMines(gBoard, gLevel.MINES, {i,j})
        setMinesNegsCount(gBoard)
        gFirstMove = false;
    }

    if(cell.isMine){
        gLives--;
        liveDisplay();

        cell.isRevealed = true; 

        if(gLives === 0){
            showAllMines(gBoard)
            document.getElementById('smiley').innerHTML = '💀';
            gGameOver = true;
            console.log('Mine triggerd! Game over!')
        } 
    }else{
        expandShown(gBoard,i,j)
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
    if(gGameOver)return;

    var cell = gBoard[i][j]
    if(cell.isRevealed) return

    cell.isFlag = !cell.isFlag

    renderBoard(gBoard);
    victoryChack(gBoard);
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
        document.getElementById('win').innerHTML = 'WINNER!';

        WIN_SOUND.play()
        //alert("Siuuuuuuu you won!🏆🍾");
    }
}

//setLevel
function setLevel(size, mines){
    gLevel.SIZE = size;
    gLevel.MINES = mines;
    gLives = size === 4 ? 1 : 3;
    onInit();
}

//expandShown
function expandShown(board,i,j){
    if(board[i][j].isRevealed)return
    board[i][j].isRevealed = true

    if(board[i][j].minesAroundCount > 0){
        return
    }

    for(var negRow = i -1; negRow <= i + 1; negRow++){
        if(negRow < 0 || negRow >= board.length) continue

        for(var negCol = j -1; negCol <= j +1; negCol++){
            if (negCol < 0 || negCol >= board[negRow].length) continue;

            if(negRow === i && negCol === j) continue

            if(!board[negRow][negCol].isMine && !board[negRow][negCol].isRevealed){
                expandShown(board,negRow,negCol);
            }
        }
    }
    renderBoard(board)
}

//liveDisplay
function liveDisplay(){
    const elLives = document.getElementById('lives')
    elLives.innerHTML = '❤️'.repeat(gLives)
}