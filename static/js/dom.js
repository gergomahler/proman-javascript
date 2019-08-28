// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";

export let dom = {
    _appendToElement: function (elementToExtend, textToAppend, prepend = false) {
        // function to append new DOM elements (represented by a string) to an existing DOM element
        let fakeDiv = document.createElement('div');
        fakeDiv.innerHTML = textToAppend.trim();

        for (let childNode of fakeDiv.childNodes) {
            if (prepend) {
                elementToExtend.prependChild(childNode);
            } else {
                elementToExtend.appendChild(childNode);
            }
        }

        return elementToExtend.lastChild;
    },
    init: function () {
        // This function should run once, when the page is loaded.
        document.getElementById("createBoard").addEventListener("click", dom.createBoard)
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function(boards){
            dom.showBoards(boards);
        });
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also

        let boardList = '';

        for(let board of boards){
            boardList += `<section class="board" id="${board.id}">
                            <div class="board-header"><span class="board-title">${board.title}</span>
                                <button class="board-add">Add Card</button>
                                <button class="board-toggle" data-board-id="${board.id}"><i class="fas fa-chevron-down"></i></button>
                            </div>
                          </section>`
        }

        const outerHtml = `<div class="board-container">${boardList}</div>`;

        document.getElementById("boards").innerText = null;
        this._appendToElement(document.querySelector('#boards'), outerHtml);
         let elements = document.getElementsByClassName('board-toggle');
         for (let element of elements) {
            element.addEventListener("click", dom.boardToggle);
        }
    },
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
        let cards = '';
        dom.showCards(cards, boardId);
    },
    showCards: function (cards, boardId) {
        // shows the cards of a board
        // it adds necessary event listeners also
        let columnList = `<div class="board-columns">
                            <div class="board-column">
                                <div class="board-column-title">New</div>
                                <div class="board-column-content"></div>
                            </div>
                            <div class="board-column">
                                <div class="board-column-title">In Progress</div>
                                <div class="board-column-content"></div>
                            </div>
                            <div class="board-column">
                                <div class="board-column-title">Testing</div>
                                <div class="board-column-content"></div>
                            </div>
                            <div class="board-column">
                                <div class="board-column-title">Done</div>
                                <div class="board-column-content"></div>
                            </div>
                          </div>`;
        columnList.toString();

        this._appendToElement(document.getElementById(boardId), columnList);

    },
    // here comes more features
    createBoard: function () {
        let boardTitle = document.getElementById('boardName');
        dataHandler.createNewBoard(boardTitle.value, dom.loadBoards);
        document.getElementById('boardName').value = null;
    },
    boardToggle: function (event) {
        let boardToggleButton = event.target;
        if (boardToggleButton.classList.contains('fas')) {
            boardToggleButton = boardToggleButton.parentElement;
        }

        let boardId = boardToggleButton.dataset.boardId;

        if (boardToggleButton.firstChild.classList.contains('fa-chevron-down')) {
            boardToggleButton.firstChild.classList.replace('fa-chevron-down', 'fa-chevron-up');
            dom.loadCards(boardId);
        } else {
            boardToggleButton.firstChild.classList.replace('fa-chevron-up', 'fa-chevron-down');
            dom.hideCards(boardId);
        }
    },
    hideCards: function (boardId) {
        let board = document.getElementById(boardId);
        board.getElementsByClassName('board-columns')[0].remove();
    }
};
