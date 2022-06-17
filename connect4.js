/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

//Make new row array, add null values to row elements * WIDTH
const makeRow = () => {
  const row = []
  for(let i = 0; i < WIDTH; i++) row.push(null);
  return row;
}
// Add makeRow() * HEIGHT and push to board array.
const makeBoard = () => {
  for(let i = 0; i < HEIGHT; i++) board.push(makeRow());
}

/** makeHtmlBoard: make HTML table and row of column tops. */

const makeHtmlBoard = () => {
  const htmlBoard = document.querySelector('#board');
  // Create top tr - set id - handle click 
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // Create top td - set id to index - append td to top
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // Create game tr - create td * WIDTH - set td id to grid numbers - append to row - repeat * HEIGHT
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for(let i = HEIGHT-1; i >= 0; i--) if(board[i][x] === null) return i;
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  const gamePiece = document.createElement('div');
  gamePiece.setAttribute('class', `piece p${currPlayer}`);
  const cell = document.getElementById(`${y}-${x}`);
  cell.append(gamePiece);
}

/** endGame: announce game end */
const endGame = (msg) => alert(msg);

/** handleClick: handle click of column top to play piece */
function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;
  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);
  // update in-memory board
  board[y][x] = currPlayer;

  // check for win
  if(checkForWin()) return endGame(`Player ${currPlayer} won!`);

  // check for tie
  // check if all cells in board are filled; if so call, call endGame
  if(board.every((arr, idx) => arr[idx] !== null )) endGame('Tie game!');

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  (currPlayer === 1) ? currPlayer = 2 : currPlayer = 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // creates a array for the 4 possible winning outcomes by looping through each col and returns true if any one of the 4 are true

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) return true;
    }
  }
}

makeBoard();
makeHtmlBoard();
