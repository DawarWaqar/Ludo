const ws = new WebSocket(`ws://localhost:8080`);

const Ludo = () => {
  const [board, setBoard] = React.useState([]);
  const [diceNum, setDiceNum] = React.useState();
  const [currentPlayerColor, setCurrentPlayerColor] = React.useState("");
  const [textBox, setTextBox] = React.useState("");
  const [currentTurn, setCurrentTurn] = React.useState("")

  ws.onmessage = (event) => {
    const clientBoard = JSON.parse(event.data);

    if (clientBoard.type === "newboard") {
      setDiceNum(clientBoard.diceNum);
      setBoard(clientBoard.board);
      setTextBox("its " + `${clientBoard.turn}` + "'s turn");
      setCurrentTurn(clientBoard.turn)
    } else if (clientBoard.type === "color") {
      setCurrentPlayerColor(clientBoard.color);
    } else {
      setTextBox(clientBoard.result);
    }
  };

  const handleClick = (event) => {
    event.preventDefault()
    const color = event.target.className;
    if (color != currentPlayerColor) return
    if (color == currentTurn) {
      const cellId = event.target.parentNode.id;
      ws.send(
        JSON.stringify({
          color: color,
          cellId: cellId,
          type: "switch position",
        })
      );
    }


  };

  return (
    <div>
      <div onClick={handleClick}>
        {board.map((e, i) => {
          return (
            <div key={i}>
              {e.map((e2, i2) => {

                  return (
                    <div
                      key={i2}
                      id={`${i}` + " " + `${i2}`}
                      className={`cell${i}${i2}`}
                    >
                      {e2.map((e3, i3) => {
                        return <div key={i3} className={e3}/>;
                      })}
                    </div>
                  );
                
              })}
            </div>
          );
        })}
        <div className="dice">{diceNum}</div>
        <div className={currentPlayerColor} />
        <div className="text_box"> {textBox}</div>
      </div>
    </div>
  );
};

ReactDOM.render(<Ludo/>, document.querySelector(`#root`));
