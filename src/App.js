import { useState } from 'react';

function Square({ value, onSquareClick, isWinningSquare }) {
  // Conditionally apply the 'winning-square' class if isWinningSquare is true
  return (
    <button className={`square ${isWinningSquare ? 'winning-square' : ''}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}


function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares);
  let status;
  if (winner)
    status = 'Winner: ' + winner;
  else
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');

  function handleClick(i) {
    if (squares[i] != null || calculateWinner(squares))
      return;
    const nextSquares = squares.slice();
    if (xIsNext)
      nextSquares[i] = 'X';
    else
      nextSquares[i] = 'O';
    onPlay(nextSquares);
  }


  let board = [];
  for (let i = 0; i < 3; i++) {
    let row = [];
    for (let j = 0; j < 3; j++) {
      const squareIndex = i * 3 + j;
      const isWinningSquare = winner && winner.includes(squareIndex);
      row.push(
        <Square
          value={squares[squareIndex]}
          onSquareClick={() => handleClick(squareIndex)}
          isWinningSquare={isWinningSquare} // Pass the isWinningSquare prop
        />
      );
    }
    board.push(<div className="board-row">{row}</div>);
  }
  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>);

}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = (currentMove % 2) === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory); // set history to nextHistory
    setCurrentMove(nextHistory.length - 1); // set currentMove to nextHistory.length - 1
    setHistory([...history, nextSquares]);  // add nextSquares to history
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove); // set currentMove to nextMove
  }

  const moves = history.map((squares, move) => {
    const desc = (move > 0) ? 'Go to move #' + move : 'Go to game start';
    return (<li key={move}><button onClick={() => jumpTo(move)}>{desc}</button></li>);
  });

  return (
    <div className="game">
      <div className="move-number">
        <span>Move #{currentMove}</span>
      </div>
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], // 1st row
    [3, 4, 5], // 2nd row
    [6, 7, 8], // 3rd row
    [0, 3, 6], // 1st column
    [1, 4, 7], // 2nd column
    [2, 5, 8], // 3rd column
    [0, 4, 8], // 1st diagonal
    [2, 4, 6], // 2nd diagonal
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]; // destructuring
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      return squares[a];
  }
  return null;
}