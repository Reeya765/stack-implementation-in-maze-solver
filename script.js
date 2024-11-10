let moveStack = [];
const tiles = Array.from(document.getElementsByClassName("tile"));
const emptyTile = document.getElementById("empty");
const messageDiv = document.getElementById("message");

function shufflePuzzle() {
  messageDiv.textContent = "Shuffling puzzle...";
  moveStack = [];
  document.getElementById("moveStack").innerHTML = "";
  
  do {
    tiles.sort(() => Math.random() - 0.5);
    tiles.forEach((tile, i) => {
      tile.style.order = i;
    });
  } while (!isSolvable());

  displayMessage("Puzzle shuffled. Try to solve it!");
}

tiles.forEach(tile => {
  tile.addEventListener("click", () => moveTile(tile));
});

function moveTile(tile) {
  if (tile === emptyTile) {
    displayMessage("Cannot move an empty tile!");
    return;
  }
  
  if (isAdjacent(tile, emptyTile)) {
    const tilePosition = tile.style.order;
    const emptyPosition = emptyTile.style.order;

    // Swap positions
    tile.style.order = emptyPosition;
    emptyTile.style.order = tilePosition;

    // Manage stack and display messages for move or undo
    if (moveStack[moveStack.length - 1] === tile.innerText) {
      moveStack.pop();
      updateStackDisplay();
      displayMessage(`Tile ${tile.innerText} popped (undo move)`);
    } else {
      moveStack.push(tile.innerText);
      updateStackDisplay();
      displayMessage(`Tile ${tile.innerText} moved`);
    }
  } else {
    // Invalid move message
    displayMessage(`Tile ${tile.innerText} cannot be moved`);
  }
}

function updateStackDisplay() {
  const stackElement = document.getElementById("moveStack");
  stackElement.innerHTML = "";
  moveStack.slice().reverse().forEach(tile => {
    const li = document.createElement("li");
    li.textContent = `Tile ${tile}`;
    stackElement.appendChild(li);
  });
}

function displayMessage(text) {
  messageDiv.textContent = text;
  setTimeout(() => (messageDiv.textContent = ""), 2000);
}

function isAdjacent(tile1, tile2) {
  const pos1 = parseInt(tile1.style.order);
  const pos2 = parseInt(tile2.style.order);
  const rowSize = 3;

  return (
    (pos1 === pos2 - 1 && pos2 % rowSize !== 0) ||
    (pos1 === pos2 + 1 && pos1 % rowSize !== 0) ||
    pos1 === pos2 - rowSize ||
    pos1 === pos2 + rowSize
  );
}

function isSolvable() {
  const positions = tiles.map(tile => parseInt(tile.style.order));
  let inversions = 0;
  for (let i = 0; i < positions.length - 1; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      if (positions[i] > positions[j] && positions[j] !== 0) {
        inversions++;
      }
    }
  }
  return inversions % 2 === 0;
}
