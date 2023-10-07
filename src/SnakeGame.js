import React, { useState, useEffect, useCallback } from 'react';
import './SnakeGame.css';

const numRows = 20;
const numCols = 20;
const cellSize = 20;

const SnakeGame = () => {
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState({ x: 5, y: 5 });
    const [dir, setDir] = useState({ x: 0, y: -1 });
    const [isGameOver, setIsGameOver] = useState(false);

    const moveSnake = useCallback(() => {
        const head = Object.assign({}, snake[0]);
        head.x += dir.x;
        head.y += dir.y;

        if (
            head.x < 0 || head.x >= numCols ||
            head.y < 0 || head.y >= numRows ||
            snake.some(s => s.x === head.x && s.y === head.y)
        ) {
            setIsGameOver(true);
            return;
        }

        const newSnake = [head, ...snake.slice(0, -1)];
        setSnake(newSnake);

        if (head.x === food.x && head.y === food.y) {
            const newFood = {
                x: Math.floor(Math.random() * numCols),
                y: Math.floor(Math.random() * numRows)
            };
            setFood(newFood);
            setSnake([...snake, {}]);
        }
    }, [snake, dir, food]);

    useEffect(() => {
        if (isGameOver) return;
        const gameInterval = setInterval(moveSnake, 200);
        return () => clearInterval(gameInterval);
    }, [moveSnake, isGameOver]);

    useEffect(() => {
        const handleKeydown = (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    if (dir.y === 0) setDir({ x: 0, y: -1 });
                    break;
                case 'ArrowDown':
                    if (dir.y === 0) setDir({ x: 0, y: 1 });
                    break;
                case 'ArrowLeft':
                    if (dir.x === 0) setDir({ x: -1, y: 0 });
                    break;
                case 'ArrowRight':
                    if (dir.x === 0) setDir({ x: 1, y: 0 });
                    break;
                default:
                    break;
            }
        };
        window.addEventListener('keydown', handleKeydown);
        return () => window.removeEventListener('keydown', handleKeydown);
    }, [dir]);

    const resetGame = () => {
        setSnake([{ x: 10, y: 10 }]);
        setFood({ x: 5, y: 5 });
        setDir({ x: 0, y: -1 });
        setIsGameOver(false);
    };

    return (
        <div className="game-container">
            <div className="grid">
                {Array.from({ length: numRows * numCols }).map((_, index) => {
                    const x = index % numCols;
                    const y = Math.floor(index / numCols);
                    const isSnake = snake.some(s => s.x === x && s.y === y);
                    const isFood = food.x === x && food.y === y;
                    return (
                        <div
                            key={index}
                            className={`cell ${isSnake ? 'snake' : ''} ${isFood ? 'food' : ''}`}
                            style={{ width: cellSize, height: cellSize }}
                        ></div>
                    );
                })}
            </div>
            {isGameOver && (
                <div className="overlay">
                    <div className="game-over">Игра завершена!</div>
                    <button onClick={resetGame} className="restart-button">Начать заново</button>
                </div>
            )}
        </div>
    );
};

export default SnakeGame;
