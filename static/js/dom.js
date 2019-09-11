// It uses data_handler.js to visualize elements
import {dataHandler} from "./data_handler.js";

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
        document.getElementById("createBoard").addEventListener("click", dom.createBoard);
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

        for (let board of boards) {
            boardList += `<section class="board" id="${board.id}" data-id="${board.id}">
                            <div class="board-header"><span class="board-title">${board.title}</span>
                                <button class="board-add" data-board-id="${board.id}" data-toggle="modal" data-target="#addCard">Add Card</button>
                                <button class="board-delete" data-board-id="${board.id}"><i class="fas fa-trash"></i></button>
                                <button class="board-toggle" data-board-id="${board.id}"><i class="fas fa-chevron-down"></i></button>
                            </div>
                          </section>`
        }

        const outerHtml = `<div class="board-container">${boardList}</div>`;

        document.getElementById("boards").innerText = null;
        this._appendToElement(document.querySelector('#boards'), outerHtml);
        let elements = document.getElementsByClassName('board-toggle');
        let titles = document.getElementsByClassName('board-title');
        let delIcons = document.getElementsByClassName('board-delete');

        for (let element of elements) {
            element.addEventListener("click", dom.boardToggle);
        }
        // for (let title of titles) {
        //     title.addEventListener("click", dom.changeBoardTitleToInputField);
        // }
        for (let delIcon of delIcons) {
            delIcon.addEventListener("click", dom.deleteBoard)
        }

        this.addEventListenerToAddCardButton();
        this.addEventListenerToBoardTitle();
    },

    addEventListenerToAddCardButton: function () {
        let addCardBtns = document.getElementsByClassName('board-add');
        for (let addCardBtn of addCardBtns) {
            addCardBtn.addEventListener('click', dom.getBoardIdForAddCardButton);
        document.getElementsByClassName("addCardBtn")[0].addEventListener("click", dom.createCard);
        }
    },

    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
        dataHandler.getCardsByBoardId(boardId, function (cards) {
            dom.showCards(cards, boardId);
        });
    },
    showCards: function (cards, boardId) {
        // shows the cards of a board
        // it adds necessary event listeners also
        let newCards = '';
        let inProgressCards = '';
        let testingCards = '';
        let doneCards = '';
        for (let card of cards) {
            if (card.status_id === 'new') {
                newCards += `<div class="card">
                             <div class="card-remove"><i data-card-id="${card.id}" class="fas fa-trash-alt"></i></div>
                             <div class="card-title">${card.title}</div>
                             </div>`
            } else if (card.status_id === 'in progress') {
                inProgressCards += `<div class="card">
                                    <div class="card-remove"><i data-card-id="${card.id}" class="fas fa-trash-alt"></i></div>
                                    <div class="card-title">${card.title}</div>
                                    </div>`
            } else if (card.status_id === 'testing') {
                testingCards += `<div class="card">
                             <div class="card-remove"><i data-card-id="${card.id}" class="fas fa-trash-alt"></i></div>
                             <div class="card-title">${card.title}</div>
                             </div>`
            } else if (card.status_id === 'done') {
                doneCards += `<div class="card">
                             <div class="card-remove"><i data-card-id="${card.id}" class="fas fa-trash-alt"></i></div>
                             <div class="card-title">${card.title}</div>
                             </div>`
            }
        }
        let newColumn = `<div class="board-column">
                                <div class="board-column-title">New</div>
                                <div class="board-column-content">${newCards}</div>
                         </div>`;
        let inProgressColumn = `<div class="board-column">
                                <div class="board-column-title">In progress</div>
                                <div class="board-column-content">${inProgressCards}</div>
                            </div>`;
        let testingColumn = `<div class="board-column">
                                <div class="board-column-title">Testing</div>
                                <div class="board-column-content">${testingCards}</div>
                            </div>`;
        let doneColumn = `<div class="board-column">
                                <div class="board-column-title">Done</div>
                                <div class="board-column-content">${doneCards}</div>
                            </div>`;

        let outerHtml = `<div class="board-columns">
                            ${newColumn}
                            ${inProgressColumn}
                            ${testingColumn}
                            ${doneColumn}
                          </div>`;
        this._appendToElement(document.getElementById(boardId), outerHtml);
        let cardDeleteIcons = document.getElementsByClassName('fa-trash-alt');
        for (let cardDeleteIcon of cardDeleteIcons) {
            cardDeleteIcon.addEventListener('click', dom.handleCardDelete);
        }

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
    },
    getBoardIdForAddCardButton: function (event) {
        let addCardBtn = event.target;
         document.getElementById('createCard').dataset.boardId = addCardBtn.dataset.boardId;
    },

    createCard: function (event) {
        let boardId = event.target.dataset.boardId;
        let cardTitle = document.getElementById('cardName').value;
        dataHandler.createNewCard(cardTitle, boardId, 0, dom.loadBoards);
        document.getElementById('cardName').value = null;
    },

    handleCardDelete: function (event) {
        const cardId = event.target.dataset.cardId;
        dataHandler.deleteCard(cardId, dom.loadBoards());
        document.getElementById('cardName').value = null
    },

    deleteBoard: function (event) {
        let deleteButton = event.target;
        if (deleteButton.classList.contains('fas')) {
            deleteButton = deleteButton.parentElement;
        }
        let boardId = deleteButton.dataset.boardId;
        dataHandler.deleteBoard(boardId, dom.loadBoards)

    },

    addEventListenerToBoardTitle: function(){
        let boardTitles = document.querySelectorAll('.board-title');
        for (let boardTitle of boardTitles) {
            boardTitle.addEventListener('click', dom.getOriginalTitle)
        }
    },

    getOriginalTitle: function (event) {
        let boardTitle = event.target;
        let boardId = boardTitle.parentElement.parentElement.dataset.id;
        let originalTitle = boardTitle.innerHTML;
        dom.createInputField(event, boardId, originalTitle)
    },

    createInputField: function(event, boardId, originalTitle) {
        let boardTitle = event.target;
        boardTitle.classList.replace('board-title', 'board-title-hidden');
        let input = document.createElement("input");
        input.type = "text";
        input.value = originalTitle;
        input.size = 10;
        boardTitle.parentNode.insertBefore(input, boardTitle);
        let saveButton = document.createElement("button");
        saveButton.type = "submit";
        saveButton.setAttribute("class", "save-button");
        saveButton.setAttribute("data-board-id", boardId);
        saveButton.innerHTML = "Save";
        boardTitle.parentNode.insertBefore(saveButton, boardTitle);
        input.focus();
        saveButton.addEventListener('click',function () {
            dom.overwriteTitle(event, boardId, boardTitle)
        })
    },

    overwriteTitle: function (event, boardId, boardTitle) {
        let input = boardTitle.parentNode.querySelector('input');
        let saveButton = boardTitle.parentNode.querySelector('.save-button');
        let newTitle = input.value;
        boardTitle.innerHTML = newTitle;
        input.remove();
        saveButton.remove();
        boardTitle.classList.replace('board-title-hidden', 'board-title');
        dataHandler.updateBoardTitle(newTitle, boardId, dom.loadBoards);
        }
};
