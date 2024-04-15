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
  return { createBoard, board };
};

const gameManager = () => {
  //create the game with this
  const startGame = (player1 = "user", player2 = "computer") => {
    let players = createPlayers(player1, player2);
    let board = boardManger();
    board.createBoard();

    for (let row of board.board) {
      for (let cell of row) {
        cell.value = "X";
      }
    }
    if (isFull(board.board)) {
      let result = checkWinner(
        players.nameToSymbol.player1,
        players.nameToSymbol.player2,
        board.board
      );
      console.log(result);
      console.log("Winner is", players.symbolToName[result]);
    }
  };

  //check if the board is full
  const isFull = (board) => {
    return board.every((row) => row.every((cell) => cell.value !== null));
  };
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

    return null;
  };

  //update the board
  const updateBoard = (token, coordinate, board) => {
    board[coordinate[0]][coordinate[1]].value = token;
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
    startGame,
  };
};

let game = gameManager();
game.startGame("KUKU", "KIKI");
