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
  return { createBoard, board, isFull, updateBoard };
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
