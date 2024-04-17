const boardManger = function () {
  let board = [];
  let grid = 3;

  let createBoard = () => {
    for (let i = 0; i < grid; i++) {
      let row = [];

      for (let j = 0; j < grid; j++) {
        row.push({ value: null });
      }
      board.push(row);
    }
  };
  //check if the board is full
  const isFull = (board) => {
    return board.every((row) => row.every((cell) => cell.value !== null));
  };
  //update board
  //update the board
  const updateBoard = (token, coordinate, board) => {
    board[coordinate[0]][coordinate[1]].value = token;
  };
  return { grid, createBoard, board, isFull, updateBoard };
};

const gameManager = () => {
  //check for winner
  const checkWinner = (token1, token2, board) => {
    const checkLine = (line) => {
      const firstValue = line[0].value;
      if (firstValue == null) return false;
      return line.every((cell) => cell.value === firstValue);
    };

    //for row
    for (let row of board) {
      if (checkLine(row)) {
        return row[0].value;
      }
      //for column
      else {
        for (let i = 0; i < board.length; i++) {
          let column = [];
          for (let j = 0; j < board.length; j++) {
            column.push(board[j][i]);
          }
          if (checkLine(column)) {
            return column[0].value;
          }
        }
      }
    }
    // Check diagonals
    const diagonals = [
      [board[0][0], board[1][1], board[2][2]],
      [board[0][2], board[1][1], board[2][0]],
    ];

    for (const diagonal of diagonals) {
      if (checkLine(diagonal)) return diagonal[0].value;
    }

    // Check for tie
    if (board.flat().every((cell) => cell.value !== null)) return "Tie";

    return false;
  };

  //creating players and assigning tokens directly
  const createPlayers = (player1 = "player1", player2 = "player2") => {
    const players = {
      player1: player1,
      player2: player2,
    };
    players.symbolToName = {
      X: player1,
      O: player2,
    };
    players.nameToSymbol = {
      player1: "X",
      player2: "O",
    };
    return players;
  };
  //return the function
  return {
    createPlayers,
    checkWinner,
  };
};

//document mockup
const documentMock = (() => ({
  querySelector: (selector) => ({ innerHTML: null }),
}))();

//UI Manager
const UIManager = ((document) => {
  let users;
  //callback for the form
  const startTheGame = function (e) {
    e.preventDefault();
    let form = new FormData(e.target);
    let player1 = form.get("player1");
    let player2 = form.get("player2");
    let btn = document.querySelector(".name-submit-button");
    if (player1 == "" || player2 == "") {
      showMessage("Please don't leave the name fields blank!", "error");
    } else {
      users = game.createPlayers(player1, player2);
      startUI();
      btn.disabled = true;
    }
  };
  //create the dialog to show message
  const showMessage = (message, types) => {
    let dialog = createElement("dialog", "dialog");
    let title = createElement("h3");
    let msg = createElement("span", "dialog-message");
    let newGame = createElement("button", "close-dialog");
    let viewboard = createElement("button", "view");
    let button_container = createElement("div", "button-container");

    newGame.textContent = "Reload";
    if ((types = "error")) viewboard.textContent = "Okay";
    else viewboard.textContent = "View Board";

    title.textContent = "Notice!";
    msg.textContent = message;

    button_container.appendChild(newGame);
    button_container.appendChild(viewboard);

    newGame.addEventListener("click", (e) => {
      window.location.reload();
    });

    viewboard.addEventListener("click", (e) => {
      dialog.style.display = "none";
      dialog.close();
    });
    dialog.appendChild(title);
    dialog.appendChild(msg);
    dialog.append(button_container);
    container.appendChild(dialog);
    dialog.showModal();
  };
  //require for inputs first
  const setUp = () => {
    let input_container = createElement("div", "input-container");
    let form = createElement("form", "users-form");

    let player1Label = createElement("label", "input-label");
    let player2Label = createElement("label", "input-label");
    player1Label.textContent = "Player1";
    player2Label.textContent = "Player2";

    player1Label.setAttribute("for", "player1-name");
    player2Label.setAttribute("for", "player2-name");

    let player1 = createElement("input", "player-name", "player1-name");
    let player2 = createElement("input", "player-name", "player2-name");
    player1.setAttribute("type", "text");
    player2.setAttribute("type", "text");
    player1.setAttribute("maxlength", "12");
    player2.setAttribute("maxlength", "12");

    player1.setAttribute("placeholder", "Player1 Name");
    player2.setAttribute("placeholder", "Player2 Name");
    player1.setAttribute("name", "player1");
    player2.setAttribute("name", "player2");

    let submitBtn = createElement("input", "name-submit-button");
    submitBtn.setAttribute("type", "submit");
    submitBtn.value = "Start";

    form.addEventListener("submit", startTheGame);

    form.appendChild(player1Label);
    form.appendChild(player1);
    form.appendChild(player2Label);
    form.appendChild(player2);
    form.appendChild(submitBtn);
    input_container.appendChild(form);
    container.appendChild(input_container);
  };
  //start building the UI
  const startUI = () => {
    const board = createBoardUI();
    container.appendChild(board);
  };
  //click callback

  const cellsClicked = (e) => {
    let element = e.target;
    let coordinate = element.value.match(/\d+/g);
    //update per click
    element.textContent = active;
    board.updateBoard(active, coordinate, boardJS);
    element.disabled = true;
    let allbutton = document.querySelectorAll(".board button");
    //Change turns
    let winner = game.checkWinner("X", "O", boardJS);
    if (winner) {
      if (winner == "X" || winner == "O") {
        winner = `Winner is \n ${users.symbolToName[winner]} !!`;
        allbutton.forEach((e) => {
          e.disabled = true;
        });
      }
      showMessage(`${winner}`);
    }
    changeActive();
  };
  //changing turns fn
  const changeActive = () => {
    active =
      active === users.nameToSymbol.player1
        ? users.nameToSymbol.player2
        : users.nameToSymbol.player1;
  };
  //create the board UI
  const createBoardUI = () => {
    let boardJs = boardManger();
    let grid = boardJs.grid;
    let board = createElement("div", "board");
    //make the buttons
    for (let i = 0; i < grid; i++) {
      let boardRow = createElement("div", "board-row");
      //for rows
      for (let j = 0; j < grid; j++) {
        let boardCells = createElement("button", "cell");
        boardCells.addEventListener("click", cellsClicked);
        //give the value address of each button on the board
        boardCells.value = `[${i}][${j}]`;
        boardRow.appendChild(boardCells);
      }
      board.appendChild(boardRow);
    }
    return board;
  };
  //create basic layout
  const createLayout = (className, id) => {
    let wrapper = createElement("div");
    if (className) wrapper.classList.add(className);
    if (id) wrapper.id = id;
    let container = createElement("div", "container");
    wrapper.appendChild(container);
    return {
      wrapper,
      container,
    };
  };
  //createELemet easy path
  const createElement = (tag = "div", Class, id) => {
    let element = document.createElement(tag);
    if (Class) element.classList.add(Class);
    if (id) element.id = id;
    return element;
  };
  //Create The Game Here
  let active = "X";
  let board = boardManger();
  board.createBoard();
  let boardJS = board.board;

  let game = gameManager();

  let layout = createLayout("wrapper");
  let container = layout.container;
  document.body.appendChild(layout.wrapper);

  return {
    setUp,
    startUI,
    createLayout,
    createElement,
  };
})(document || documentMock);

let ui = UIManager;
ui.setUp();
