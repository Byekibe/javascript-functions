function seed() {
  const args = [...arguments];
  return args;
}

function same([x, y], [j, k]) {
  return x === j && y === k;
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  let isAlive = false;

  const gameState = [...this];

  for (let i = 0; i < gameState.length; i++) {
    if (gameState[i][0] === cell[0] && gameState[i][1] === cell[1]) {
      isAlive = true;
    }
  }
  return isAlive;
}

const printCell = (cell, state) => {
  const isIn = contains.call(state, cell);
  if (isIn) {
    return "\u25A3";
  } else {
    return "\u25A2";
  }
};

const corners = (state = []) => {
  if (state.length === 0) {
    return {topRight: [0,0], bottomLeft: [0,0] };
  } else if (state.length === 1) {
    return { topRight: state[0][0], bottomLeft: state[0][1] };
  } else {
    let topRight = [state[0][0], state[0][1]];
    let bottomLeft = [state[0][0], state[0][1]];

    for (let i = 0; i < state.length; i++) {

      if (topRight[0] < state[i][0]) {
        topRight[0] = state[i][0];
      }
      if (topRight[1] < state[i][1]) {
        topRight[1] = state[i][1];
      }
      if (bottomLeft[0] > state[i][0]) {
        bottomLeft[0] = state[i][0];
      }
      if (bottomLeft[1] > state[i][1]) {
        bottomLeft[1] = state[i][1];
      }
    }
    return {
      topRight: [...topRight],
      bottomLeft: [...bottomLeft],
    };
  }
};

const printCells = (state) => {
  const { topRight, bottomLeft } = corners(state);
  let cells = "";

  for (let j = topRight[1]; j >= bottomLeft[1]; j--) {
    let row = [];
    for (let i = bottomLeft[0]; i <= topRight[0]; i++) {
      // cells += printCell([i, j], state) + " ";
      row.push(printCell([i, j], state));
    }
    // cells += "\n";
    cells += row.join(" ") + "\n";
  }
  return cells;
  
};

const getNeighborsOf = ([x, y]) => {
  return [
    [x - 1, y - 1],
    [x, y - 1],
    [x + 1, y - 1],
    [x - 1, y],
    [x - 1, y + 1],
    [x, y + 1],
    [x + 1, y],
    [x + 1, y + 1],
  ];
};

const getLivingNeighbors = (cell, state) => {
  const neighbors = getNeighborsOf(cell);
  const livingNeighbors = [];
  for (const neighbor of neighbors) {
    const isContained = contains.bind(state)(neighbor);
    if (isContained) {
      livingNeighbors.push(neighbor);
    }
  }
  return livingNeighbors;
};

const willBeAlive = (cell, state) => {
  return getLivingNeighbors(cell, state).length === 3 ||
  (contains.call(state, cell) && getLivingNeighbors(cell, state).length === 2)
  ? true
  : false;
};

const calculateNext = (state) => {
  let { topRight, bottomLeft } = corners(state);

  topRight = [topRight[0] + 1, topRight[1] + 1];
  bottomLeft = [bottomLeft[0] - 1, bottomLeft[1] - 1];

  const gameState = [];
  for (let i = bottomLeft[0]; i <= topRight[0]; i++) {
    for (let j = bottomLeft[1]; j <= topRight[1]; j++) {
      if (willBeAlive([i, j], state)) {
        gameState.push([i, j]);
      }
    }
  }
  return gameState;
};

const iterate = (state, iterations) => {
  const gameState = [state];
  for (let i = 0; i < iterations; i++) {
    let newState;
    newState = calculateNext(gameState[gameState.length - 1]);
    gameState.push(newState);
  }
  return gameState;
};

const main = (pattern, iterations) => {
  const gameStates = iterate(startPatterns[pattern], iterations);
  gameStates.forEach((gameState) => console.log(printCells(gameState)));
};

const startPatterns = {
    rpentomino: [
      [3, 2],
      [2, 3],
      [3, 3],
      [3, 4],
      [4, 4]
    ],
    glider: [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
      [1, 1],
      [2, 1],
      [3, 1],
      [3, 2],
      [2, 3]
    ],
    square: [
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2]
    ]
  };
  
  const [pattern, iterations] = process.argv.slice(2);
  const runAsScript = require.main === module;
  
  if (runAsScript) {
    if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
      main(pattern, parseInt(iterations));
    } else {
      console.log("Usage: node js/gameoflife.js rpentomino 50");
    }
  }
  
  exports.seed = seed;
  exports.same = same;
  exports.contains = contains;
  exports.getNeighborsOf = getNeighborsOf;
  exports.getLivingNeighbors = getLivingNeighbors;
  exports.willBeAlive = willBeAlive;
  exports.corners = corners;
  exports.calculateNext = calculateNext;
  exports.printCell = printCell;
  exports.printCells = printCells;
  exports.startPatterns = startPatterns;
  exports.iterate = iterate;
  exports.main = main;