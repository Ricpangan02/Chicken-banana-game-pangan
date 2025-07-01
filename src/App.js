import React, { useState, useEffect } from 'react';
import './App.css';

const imageUrls = {
  banana: 'https://thumbs.dreamstime.com/b/bunch-bananas-6175887.jpg?w=768',
  chicken: 'https://thumbs.dreamstime.com/z/full-body-brown-chicken-hen-standing-isolated-white-backgroun-background-use-farm-animals-livestock-theme-49741285.jpg?ct=jpeg',
};

const GRID_SIZE = 5;
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;

function generateBoard() {
  return Array.from({ length: TOTAL_CELLS }, () => {
    const isBanana = Math.random() < 0.5;
    return {
      image: isBanana ? 'banana' : 'chicken',
      revealed: false,
    };
  });
}

function App() {
  const [board, setBoard] = useState(generateBoard());
  const [playerChoice, setPlayerChoice] = useState(null);
  const [correctCount, setCorrectCount] = useState({ chicken: 0, banana: 0 });
  const [playerScore, setPlayerScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (playerChoice) {
      const totalCorrect = board.filter(cell => cell.image === playerChoice).length;
      if (playerScore === totalCorrect) {
        setGameOver(true);
        setMessage('🎉 You win! All correct tiles revealed!');
      }
    }
  }, [playerScore, board, playerChoice]);

  const handleClick = (index) => {
    if (gameOver || board[index].revealed || !playerChoice) return;

    const cell = board[index];
    const isCorrect = cell.image === playerChoice;

    const updatedBoard = [...board];
    updatedBoard[index].revealed = true;
    setBoard(updatedBoard);

    if (isCorrect) {
      setCorrectCount(prev => ({
        ...prev,
        [playerChoice]: prev[playerChoice] + 1
      }));
      setPlayerScore(prev => prev + 1);
    } else {
      setGameOver(true);
      setMessage('💥 Wrong tile! Game over. You clicked the opponent’s image.');
    }
  };

  const handleNewGame = () => {
    setBoard(generateBoard());
    setCorrectCount({ chicken: 0, banana: 0 });
    setPlayerScore(0);
    setGameOver(false);
    setMessage('');
    setPlayerChoice(null);
  };

  return (
    <div className="container">
      <h1>🐔🍌 Chicken Banana Sweeper</h1>

      {!playerChoice && (
        <div className="role-select">
          <p>Select your player:</p>
          <button onClick={() => setPlayerChoice('chicken')}>I’m Chicken 🐔</button>
          <button onClick={() => setPlayerChoice('banana')}>I’m Banana 🍌</button>
        </div>
      )}

      {playerChoice && (
        <>
          <div className="scoreboard">
            <div>🐔 Chicken Score: {correctCount.chicken}</div>
            <div>🍌 Banana Score: {correctCount.banana}</div>
          </div>
          <p>You are playing as: <strong>{playerChoice.toUpperCase()}</strong></p>
        </>
      )}

      {message && <div className="message">{message}</div>}

      <div className="grid grid-5x5">
        {board.map((cell, index) => (
          <button
            key={index}
            className="square"
            onClick={() => handleClick(index)}
            disabled={gameOver || cell.revealed}
          >
            {cell.revealed && (
              <img
                src={imageUrls[cell.image]}
                alt={cell.image}
              />
            )}
          </button>
        ))}
      </div>

      {/* ✅ New Game Button moved below the grid */}
      <button className="new-game-button" onClick={handleNewGame}>🔄 New Game</button>
    </div>
  );
}

export default App;
