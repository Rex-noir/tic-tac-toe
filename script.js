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
    const checkLine = (line) =>
      line.every((cell) => cell.value === token1 || cell.value === token2);

    //for each row
    for (const row of board) {
      if (checkLine(row)) {
        return row[0].value;
      }
    }
    //for column
    for (let col = 0; col < board.length; col++) {
      const column = board.map((row) => row[col]);
      if (checkLine(column)) {
        return column[0].value;
      }
    }
    //for diagonally
    const diagonal1 = [board[0][1], board[1][1], board[2][2]];
    const diagonal2 = [board[0][2], board[1][1], board[2][0]];
    if (checkLine(diagonal1) || checkLine(diagonal2)) {
      return diagonal1[0].value;
    }
    //check for tie
    if (board.every((row) => row.every((cell) => cell.value !== null))) {
      return "Tie";
    }

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
  //start building the UI
  const startUI = () => {
    let layout = createLayout("wrapper");
    container = layout.container;
    const board = createBoardUI();
    container.appendChild(board);
    document.body.appendChild(layout.wrapper);
  };

  //Create The Game Here
  let active = "X";
  let board = boardManger();
  board.createBoard();
  let boardJS = board.board;

  let game = gameManager();
  let users = game.createPlayers("Jujutsu", "Lily");

  //click callback
  const cellsClicked = (e) => {
    let element = e.target;
    let coordinate = element.value.match(/\d+/g);

    //update per click
    element.textContent = active;
    board.updateBoard(active, coordinate, boardJS);
    element.disabled = true;
    //Change turns
    changeActive();
  };
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
        boardCells.textContent = "BUU";
        boardRow.appendChild(boardCells);
      }
      board.appendChild(boardRow);
    }
    return board;
  };
  //add titles and form
  const addTitles = (titles, container) => {
    let title = createElement("span", "title");
    container.appendChild(title);
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
  return {
    startUI,
    createLayout,
    createElement,
  };
})(document || documentMock);

let ui = UIManager;
ui.startUI();
