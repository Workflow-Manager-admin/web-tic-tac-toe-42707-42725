import React, { useEffect, useState } from "react";
import "./App.css";

// PRIVATE: Board utility functions

const getInitialBoard = () => Array(3).fill(null).map(() => Array(3).fill(null));

function calculateWinner(board) {
  // Check rows, columns, diagonals
  for (let i = 0; i < 3; i++) {
    // Rows
    if (
      board[i][0] &&
      board[i][0] === board[i][1] &&
      board[i][0] === board[i][2]
    ) {
      return { winner: board[i][0], line: [[i,0],[i,1],[i,2]]};
    }
    // Columns
    if (
      board[0][i] &&
      board[0][i] === board[1][i] &&
      board[0][i] === board[2][i]
    ) {
      return { winner: board[0][i], line: [[0,i],[1,i],[2,i]]};
    }
  }
  // Diagonals
  if (
    board[0][0] &&
    board[0][0] === board[1][1] &&
    board[0][0] === board[2][2]
  ) {
    return { winner: board[0][0], line: [[0,0],[1,1],[2,2]] };
  }
  if (
    board[0][2] &&
    board[0][2] === board[1][1] &&
    board[0][2] === board[2][0]
  ) {
    return { winner: board[0][2], line: [[0,2],[1,1],[2,0]] };
  }
  // No winner
  return null;
}

// BoardCell: A single tic-tac-toe board cell
function BoardCell({ value, onClick, isWinning, disabled }) {
  return (
    <button
      className={`ttt-cell${isWinning ? " ttt-cell-winning" : ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={`Cell ${value ? value : "empty"}`}
      tabIndex={disabled ? -1 : 0}
    >
      <span className={`ttt-cell-content ttt-cell-content-${value ? value : "empty"}`}>
        {value}
      </span>
    </button>
  );
}

// Board: The 3x3 game board
function Board({ board, onCellClick, winningLine, isGameOver }) {
  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe Board">
      {board.map((row, rowIdx) =>
        row.map((cell, colIdx) => {
          const isWinning =
            winningLine &&
            winningLine.some(([r, c]) => r === rowIdx && c === colIdx);
          return (
            <BoardCell
              key={`${rowIdx}-${colIdx}`}
              value={cell}
              onClick={() => onCellClick(rowIdx, colIdx)}
              isWinning={isWinning}
              disabled={cell || isGameOver}
            />
          );
        })
      )}
    </div>
  );
}

// GameStatus: Display status line to user
function GameStatus({ currentPlayer, winner, draw }) {
  let status;
  if (winner) {
    status = (
      <>
        <span className="ttt-winner">Player {winner === "X" ? "1 (X)" : "2 (O)"} wins!</span>
      </>
    );
  } else if (draw) {
    status = <span className="ttt-draw">It's a draw!</span>;
  } else {
    status = (
      <>
        <span className="ttt-turn">
          Player {currentPlayer === "X" ? "1 (X)" : "2 (O)"}'s turn
        </span>
      </>
    );
  }
  return <div className="ttt-status">{status}</div>;
}

// PUBLIC_INTERFACE
function App() {
  const [board, setBoard] = useState(getInitialBoard()); // 3x3 array
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState(null);
  const [draw, setDraw] = useState(false);

  // Effect for winner & draw on every board change
  useEffect(() => {
    const winResult = calculateWinner(board);
    if (winResult) {
      setWinner(winResult.winner);
      setWinningLine(winResult.line);
    } else if (
      board.flat().every((cell) => cell)
    ) {
      setDraw(true);
    } else {
      setWinner(null);
      setWinningLine(null);
      setDraw(false);
    }
  }, [board]);

  // PUBLIC_INTERFACE
  const handleCellClick = (row, col) => {
    if (board[row][col] || winner || draw) return;
    setBoard((prev) => {
      const next = prev.map((r) => [...r]);
      next[row][col] = currentPlayer;
      return next;
    });
    setCurrentPlayer((prev) => (prev === "X" ? "O" : "X"));
  };

  // PUBLIC_INTERFACE
  const restartGame = () => {
    setBoard(getInitialBoard());
    setCurrentPlayer("X");
    setWinner(null);
    setWinningLine(null);
    setDraw(false);
  };

  return (
    <div className="App ttt-root">
      <main className="ttt-container">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <GameStatus currentPlayer={currentPlayer} winner={winner} draw={draw} />
        <Board
          board={board}
          onCellClick={handleCellClick}
          winningLine={winningLine}
          isGameOver={!!winner || draw}
        />
        <div className="ttt-controls">
          <button className="ttt-btn ttt-btn-restart" onClick={restartGame}>
            Restart Game
          </button>
        </div>
        <section className="ttt-info">
          <div>
            <span className="ttt-player ttt-player-x">
              <span className="ttt-avatar ttt-avatar-x">X</span> Player 1
            </span>
            &nbsp;vs.&nbsp;
            <span className="ttt-player ttt-player-o">
              <span className="ttt-avatar ttt-avatar-o">O</span> Player 2
            </span>
          </div>
        </section>
      </main>
      <footer className="ttt-footer">
        <span>
          Built with <span style={{ color: "var(--ttt-accent)" }}>♥</span> React Tic Tac Toe
        </span>
      </footer>
    </div>
  );
}

export default App;
