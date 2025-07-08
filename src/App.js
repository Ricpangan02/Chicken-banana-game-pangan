import React, { useState, useEffect } from 'react';
import './App.css';

const imageUrls = {
  banana: 'https://thumbs.dreamstime.com/b/bunch-bananas-6175887.jpg?w=768',
  chicken: 'https://thumbs.dreamstime.com/z/full-body-brown-chicken-hen-standing-isolated-white-backgroun-background-use-farm-animals-livestock-theme-49741285.jpg?ct=jpeg',
};

const GRID_ROWS = 4;
const GRID_COLS = 4;
const TOTAL_CELLS = GRID_ROWS * GRID_COLS;

function generateBoard() {
  const numBanana = TOTAL_CELLS / 2; // 8
  const numChicken = TOTAL_CELLS / 2; // 8

  const images = [
    ...Array(numBanana).fill('banana'),
    ...Array(numChicken).fill('chicken'),
  ];

  // Shuffle the array
  for (let i = images.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [images[i], images[j]] = [images[j], images[i]];
  }

  return images.map(img => ({
    image: img,
    revealed: false,
  }));
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
        setMessage('🎉 You win! All your tiles revealed!');
      }
    }
  }, [playerScore, board, playerChoice]);

  const handleClick = (index) => {
    if (gameOver || board[index].revealed || !playerChoice) return;

    const clickedCell = board[index];
    const isCorrect = clickedCell.image === playerChoice;

    // Reveal all tiles after any click
    const revealedBoard = board.map(cell => ({ ...cell, revealed: true }));
    setBoard(revealedBoard);

    if (isCorrect) {
      const newScore = playerScore + 1;
      setPlayerScore(newScore);
      setCorrectCount(prev => ({
        ...prev,
        [playerChoice]: prev[playerChoice] + 1,
      }));

      const totalCorrect = revealedBoard.filter(cell => cell.image === playerChoice).length;
      if (newScore === totalCorrect) {
        setGameOver(true);
        setMessage('🎉 You win! All your tiles revealed!');
      }
    } else {
      setGameOver(true);
      const otherPlayer = playerChoice === 'chicken' ? 'banana' : 'chicken';
      setMessage(`💥 Wrong tile! ${otherPlayer.toUpperCase()} wins by consistency!`);
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

      <div className="grid grid-4x4">
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

      {gameOver && (
        <div className="tile-ratio">
          <p>Total Chickens: {board.filter(c => c.image === 'chicken').length}</p>
          <p>Total Bananas: {board.filter(c => c.image === 'banana').length}</p>
        </div>
      )}

      <button className="new-game-button" onClick={handleNewGame}>🔄 New Game</button>
    </div>
  );
}

export default App;
