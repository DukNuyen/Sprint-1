'use strict'

//createMat

function createMat(rows, cols) {
    const mat = []
    for (var i = 0; i < rows; i++) {
        const row = []
        for (var j = 0; j < cols; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

//randomInt

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

function start() {

    x = setInterval(timer, 10);
    renderQuests();
    gCurrQuestIdx++
} /* Start */

function stop() {
    clearInterval(x);
    GstartStop = !GstartStop
} /* Stop */