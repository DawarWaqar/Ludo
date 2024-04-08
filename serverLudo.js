const fs = require(`fs`);
const http = require(`http`);
const WebSocket = require(`ws`);

const readFile = (fileName) =>
  new Promise((resolve, reject) => {
    fs.readFile(fileName, `utf-8`, (readErr, fileContents) => {
      if (readErr) {
        reject(readErr);
      } else {
        resolve(fileContents);
      }
    });
  });

const server = http.createServer(async (req, resp) => {
  if (req.url == `/letsPlayLudo`) {
    const clientHtml = await readFile(`clientLudo.html`);
    resp.end(clientHtml);
  } else if (req.url == `/myjs`) {
    const clientJs = await readFile(`clientLudo.js`);
    resp.end(clientJs);
  } else if (req.url == `/ludo.css`) {
    const clientCSS = await readFile(`ludo.css`);
    resp.end(clientCSS);
  } else {
    resp.end(`Not found`);
  }
});

server.listen(8000);

const wss = new WebSocket.Server({ port: 8080 });

let state = [
  // initial state
  [
    ["blue", "blue", "blue", "blue"],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    ["red", "red", "red", "red"],
  ],
  [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
  [
    ["yellow", "yellow", "yellow", "yellow"],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    ["green", "green", "green", "green"],
  ],
];

// let state = [
//   //for going in and kill and winning and safe spots
//   [
//     ["blue", "blue"],
//     [],
//     [],
//     [],
//     [],
//     [],
//     [],
//     [],
//     [],
//     [],
//     [],
//     [],
//     [],
//     [],
//     ["red", "red", "red"],
//   ],
//   [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
//   [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
//   [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
//   [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
//   [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
//   [["red"], ["blue"], [], [], [], [], [], [], [], [], [], [], [], [], []],
//   [
//     [],
//     [],
//     [],
//     [],
//     [],
//     [],
//     [],
//     [],
//     ["green", "green", "green"],
//     ["green"],
//     [],
//     [],
//     [],
//     [],
//     [],
//   ],
//   [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
//   [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
//   [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
//   [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
//   [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
//   [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
//   [
//     ["yellow", "yellow"],
//     [],
//     [],
//     [],
//     [],
//     [],
//     [],
//     ["yellow", "yellow"],
//     ["blue"],
//     [],
//     [],
//     [],
//     [],
//     [],
//     [],
//   ],
// ];

const isIncluded = (safeArr, cordArr) => {
  for (let index = 0; index < safeArr.length; index++) {
    let bol = false;
    for (let j = 0; j < safeArr[index].length; j++) {
      if (safeArr[index][j] === cordArr[j]) {
        bol = true;
      } else {
        bol = false;
        break;
      }
    }
    if (bol) {
      return true;
    }
  }
  return false;
};

const kill = (newPosi, colour) => {
  let newLoc = state[newPosi[0]][newPosi[1]];

  if (
    newLoc.length != 0 &&
    newLoc[0] != colour &&
    isIncluded(safeSpots, [newPosi[0], newPosi[1]]) == false
  ) {
    if (newLoc[0] == "red") {
      for (let index = 0; index < newLoc.length; index++) {
        state[0][14].push("red");
      }
    } else if (newLoc[0] == "blue") {
      for (let index = 0; index < newLoc.length; index++) {
        state[0][0].push("blue");
      }
    } else if (newLoc[0] == "green") {
      for (let index = 0; index < newLoc.length; index++) {
        state[14][14].push("green");
      }
    } else if (newLoc[0] == "yellow") {
      for (let index = 0; index < newLoc.length; index++) {
        state[14][0].push("yellow");
      }
    }
    state[newPosi[0]][newPosi[1]] = [];
  }
};
const step = (color, ox, oy, steps) => {
  try {
    const transform = ([ox, oy]) =>
      ({
        blue: [+ox, +oy],
        green: [-ox, -oy],
        red: [-oy, +ox],
        yellow: [+oy, -ox],
      }[color]);
    const path = [
      "-7,-7",
      "-1,-6",
      "-1,-5",
      "-1,-4",
      "-1,-3",
      "-1,-2",
      "-2,-1",
      "-3,-1",
      "-4,-1",
      "-5,-1",
      "-6,-1",
      "-7,-1",
      "-7,0",
      "-7,1",
      "-6,1",
      "-5,1",
      "-4,1",
      "-3,1",
      "-2,1",
      "-1,2",
      "-1,3",
      "-1,4",
      "-1,5",
      "-1,6",
      "-1,7",
      "0,7",
      "1,7",
      "1,6",
      "1,5",
      "1,4",
      "1,3",
      "1,2",
      "2,1",
      "3,1",
      "4,1",
      "5,1",
      "6,1",
      "7,1",
      "7,0",
      "7,-1",
      "6,-1",
      "5,-1",
      "4,-1",
      "3,-1",
      "2,-1",
      "1,-2",
      "1,-3",
      "1,-4",
      "1,-5",
      "1,-6",
      "1,-7",
      "0,-7",
      "0,-6",
      "0,-5",
      "0,-4",
      "0,-3",
      "0,-2",
      "0,-1",
    ];
    const [x, y] = transform(
      transform(
        transform(
          path[
            path.indexOf(transform([ox - 7, oy - 7]).join(",")) + steps
          ].split(",")
        )
      )
    );
    return [x + 7, y + 7];
  } catch (err) {
    return "not possible";
  }
};

const generateRandomDiceNum = () => {
  return Math.floor(Math.random() * 6) + 1;
  // return 1; //for ones
};
const safeSpots = [
  [6, 1],
  [2, 6],
  [1, 8],
  [6, 12],
  [8, 13],
  [12, 8],
  [8, 2],
  [13, 6],
];
let colorArr = ["color green", "color red", "color blue", "color yellow"];
let clients = [];
let turnInt = 0;
let turnDic = { 0: "yellow", 1: "blue", 2: "red", 3: "green" };
let checkL = true;
let diceNum = generateRandomDiceNum();
wss.on(`connection`, (ws) => {
  if (clients.length == 4) {
    ws.send(
      JSON.stringify({
        type: "error",
        message: "The game room is full. Please try again later.",
      })
    );
    ws.close();
    return;
  }

  console.log(`A user connected`);
  clients.push(ws);
  ws.send(
    JSON.stringify({
      type: "color",
      color: colorArr.pop(),
      message: "Waiting for other players..",
    })
  );

  if (clients.length == 4) {
    //start new game
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: "newboard",
            board: state,
            diceNum: diceNum,
            turn: turnDic[turnInt],
          })
        );
      }
    });
  }

  const iskilled = (ox, oy) => (ox - 7) * (ox - 7) + (oy - 7) * (oy - 7) == 98;

  ws.on("close", () => {
    console.log("A user disconnected");

    clients.forEach((client) => {
      client.send(
        JSON.stringify({
          type: "error",
          message: "A user has disconnected from the game. Game ended.",
        })
      );
      // }
      client.close();
    });
    clients = [];
    colorArr = ["color green", "color red", "color blue", "color yellow"];
  });

  ws.on(`message`, (message) => {
    let msg = JSON.parse(message);
    let type = msg.type;

    if (type == "show dice") {
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              type: "show dice",
            })
          );
        }
      });
    }
    if (type == "switch position") {
      turnInt = (turnInt + 1) % 4;

      let color = msg.color;
      let cellId = msg.cellId;
      cellId = cellId.split(" ");
      let i = parseInt(cellId[0]);
      let i2 = parseInt(cellId[1]);
      if (iskilled(i, i2)) {
        //home condition
        if (diceNum == 6) {
          const index = state[i][i2].indexOf(color);
          if (index !== -1) {
            state[i][i2].splice(index, 1);
          }

          //adding to state at new position
          let newPos = step(color, i, i2, 1);

          state[newPos[0]][newPos[1]].push(color);

          diceNum = generateRandomDiceNum();

          clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "newboard",
                  board: state,
                  diceNum: diceNum,
                  turn: turnDic[turnInt],
                })
              );
            }
          });
        } else {
          diceNum = generateRandomDiceNum();
          clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "newboard",
                  board: state,
                  diceNum: diceNum,
                  turn: turnDic[turnInt],
                })
              );
            }
          });
        }
      } else {
        let newPos = step(color, i, i2, diceNum);

        if (newPos != "not possible") {
          const index = state[i][i2].indexOf(color);
          if (index !== -1) {
            state[i][i2].splice(index, 1);
          }
          kill(newPos, color);
          state[newPos[0]][newPos[1]].push(color);

          if (state[8][7].length == 4) {
            clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(
                  JSON.stringify({
                    type: "newboard",
                    board: state,
                    diceNum: diceNum,
                    turn: turnDic[turnInt],
                  })
                );
                client.send(
                  JSON.stringify({
                    type: "who won",
                    result: "yellow won",
                  })
                );
              }
            });
          } else if (state[7][6].length == 4) {
            clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(
                  JSON.stringify({
                    type: "newboard",
                    board: state,
                    diceNum: diceNum,
                    turn: turnDic[turnInt],
                  })
                );
                client.send(
                  JSON.stringify({
                    type: "who won",
                    result: "blue won",
                  })
                );
              }
            });
          } else if (state[6][7].length == 4) {
            clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(
                  JSON.stringify({
                    type: "newboard",
                    board: state,
                    diceNum: diceNum,
                    turn: turnDic[turnInt],
                  })
                );
                client.send(
                  JSON.stringify({
                    type: "who won",
                    result: "red won",
                  })
                );
              }
            });
          } else if (state[7][8].length == 4) {
            clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(
                  JSON.stringify({
                    type: "newboard",
                    board: state,
                    diceNum: diceNum,
                    turn: turnDic[turnInt],
                  })
                );
                client.send(
                  JSON.stringify({
                    type: "who won",
                    result: "green won",
                  })
                );
              }
            });
          } else {
            diceNum = generateRandomDiceNum();
            clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(
                  JSON.stringify({
                    type: "newboard",
                    board: state,
                    diceNum: diceNum,
                    turn: turnDic[turnInt],
                  })
                );
              }
            });
          }
        } else {
          diceNum = generateRandomDiceNum();
          clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "newboard",
                  board: state,
                  diceNum: diceNum,
                  turn: turnDic[turnInt],
                })
              );
            }
          });
        }
      }
    }
  });
});
