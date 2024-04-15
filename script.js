let gameBoard = function () {
  let board = [];
  let grid = 3;

  let createBoard = () => {
    for (let i = 0; i < grid; i++) {
      let row = [];

      for (let j = 0; j < grid; j++) {
        row.push("");
      }
      board.push(row);
    }
  };
  return { createBoard, board };
};

let board = gameBoard();

//make a game function
function game() {}
