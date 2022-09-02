// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from "../utils";

function Board({onClick, squares}) {

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
    const defaultSquares = Array(9).fill(null)
    const [squares, setSquares] = useLocalStorageState("squares", defaultSquares)
    const [history, setHistory] = useLocalStorageState("history", [])
    const [step, setStep] = useLocalStorageState("step", 0)
    const nextValue = calculateNextValue(squares)
    const winner = calculateWinner(squares)
    const status = calculateStatus(winner, squares, nextValue)

    const moves = history.map((stepHistory, index) => (
        <li key={index}>
            <button onClick={() => handleMoveInHistory(index)}>
                {step === index ? `Go to move ${index + 1} (Current)` : `Go to move ${index + 1}`}
            </button>
        </li>)
    )

    function handleMoveInHistory(historyIndex) {
        setStep(historyIndex)
        // setHistory(history.slice(0,historyIndex+1))
        setSquares(history[historyIndex])
    }

    function restart() {
        setSquares(defaultSquares)
        setHistory([])
        setStep(0)
    }

    function selectSquare(squareIndex) {
        if (winner) {
            return
        }
        if (squares[squareIndex]) {
            return
        }

        const squaresCopy = [...squares]
        squaresCopy[squareIndex] = nextValue
        setSquares(squaresCopy)
        console.log("squaresCopy", squaresCopy)
        setHistory([...history.slice(0, step + 1), squaresCopy])
        console.log("history", history)
        setStep(step + 1)
    }

    return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={squares}/>
        <button className="restart" onClick={restart}>
            restart
        </button>
      </div>
      <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
      </div>
    </div>
  )
}

function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
