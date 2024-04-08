const ws = new WebSocket(`ws://localhost:8080`);

const Ludo = () => {
  const [lBoard, setLBoard] = React.useState([]);
  const [diceNum, setDiceNum] = React.useState();
  const [colorClass, setColorClass] = React.useState("");
  const [textBox, setTextBox] = React.useState("");
  const [isMyTurn, setIsMyTurn] = React.useState(false);
  const [showDice, setShowDice] = React.useState(false);

  ws.onmessage = (event) => {
    const clientBoard = JSON.parse(event.data);

    if (clientBoard.type === "error") {
      setTextBox(clientBoard.message);
      ws.close();
    }

    if (clientBoard.type === "newboard") {
      setShowDice(false);
      let tempDice = clientBoard.diceNum;
      setDiceNum(tempDice);
      setLBoard(clientBoard.board);
      const myTurn = clientBoard.turn == colorClass.split(" ")[1];
      setIsMyTurn(myTurn);

      const textBox = `Its ${clientBoard.turn}'s turn. ${
        myTurn ? "Roll the dice.." : ""
      }`;
      setTextBox(textBox);
    } else if (clientBoard.type === "color") {
      let tempColor = clientBoard.color;
      setColorClass(tempColor);
      setTextBox(clientBoard.message);
    } else if (clientBoard.type === "who won") {
      setTextBox(`${clientBoard.result}! Game ended`);
    } else if (clientBoard.type === "show dice") {
      setShowDice(true);
    }
  };

  const handleClickDice = () => {
    if (isMyTurn) {
      ws.send(
        JSON.stringify({
          type: "show dice",
        })
      );
      setShowDice(true);
    }
  };

  const handleClick = (event) => {
    if (!showDice) return;
    let color = event.target.className;
    let cellId = event.target.parentNode.id;
    let temp = colorClass.split(" ")[1];
    let turn = textBox.split(" ")[1];
    turn = turn.split("'")[0];
    if (color == temp && color == turn) {
      ws.send(
        JSON.stringify({
          color: color,
          cellId: cellId,
          type: "switch position",
        })
      );
    }

    let won = textBox.split(" ")[1];

    if (color != turn && color == temp && won != "won") {
      setTextBox("Its not your turn");
    }
  };

  return (
    <div className="game-container">
      <div className="big-letter">L</div>
      <div className="big-letter" style={{ marginTop: "1em" }}>
        U
      </div>
      <div className="big-letter" style={{ marginTop: "2em" }}>
        D
      </div>
      <div className="big-letter" style={{ marginTop: "3em" }}>
        O
      </div>
      <div className="big-letter-right">L</div>
      <div className="big-letter-right" style={{ marginTop: "1em" }}>
        U
      </div>
      <div className="big-letter-right" style={{ marginTop: "2em" }}>
        D
      </div>
      <div className="big-letter-right" style={{ marginTop: "3em" }}>
        O
      </div>
      <div className="footer">
        <div className="made-by">Made By Dawar Waqar</div>
        <div className="made-for">For The ASE Course</div>
        {/* <div className="heart">&hearts;</div> */}
      </div>
      <div onClick={handleClick}>
        {lBoard.map((e, i) => {
          return (
            <div>
              {e.map((e2, i2) => {
                if (e2.length != 0) {
                  return (
                    <div
                      id={`${i}` + " " + `${i2}`}
                      className={`cell${i}${i2}`}
                    >
                      {e2.map((e3, i3) => {
                        return <div className={e3}></div>;
                      })}
                    </div>
                  );
                } else {
                  return (
                    <div
                      id={`${i}` + " " + `${i2}`}
                      className={`cell${i}${i2}`}
                    ></div>
                  );
                }
              })}
            </div>
          );
        })}
        <div
          className={`dice ${!showDice && isMyTurn ? "blinkDice" : ""}`}
          onClick={handleClickDice}
        >
          {showDice && diceNum}
        </div>
        <div className={colorClass} />
        <div className="text_box"> {textBox}</div>
      </div>
    </div>
  );
};

ReactDOM.render(<Ludo />, document.querySelector(`#root`));
