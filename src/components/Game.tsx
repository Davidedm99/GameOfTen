import React, { useState, useEffect } from "react";
import NumberSlot from "./NumberSlot";
import GameStatus from "./GameStatus";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight } from "lucide-react";

const MAX_NUMBER = 100;
const MIN_NUMBER = 1;
const SLOTS = 10;

const Game: React.FC = () => {
  const { toast } = useToast();
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [placedNumbers, setPlacedNumbers] = useState<(number | null)[]>(Array(SLOTS).fill(null));
  const [gameOver, setGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [score, setScore] = useState(0);
  const [usedNumbers, setUsedNumbers] = useState<number[]>([]);
  const [wrongMovePosition, setWrongMovePosition] = useState<number | null>(null);

  // Generate a new random number
  const generateNumber = () => {
    let newNumber;
    do {
      newNumber = Math.floor(Math.random() * MAX_NUMBER) + MIN_NUMBER;
    } while (usedNumbers.includes(newNumber));

    setCurrentNumber(newNumber);
  };

  // Start the game
  useEffect(() => {
    generateNumber();
  }, []);

  // Check if player has won
  useEffect(() => {
    if (score === SLOTS) {
      setGameOver(true);
      setIsWin(true);
      toast({
        title: "Congratulations!",
        description: "You won the game!",
        variant: "default",
      });
    }
  }, [score, toast]);

  // Place a number in a slot
  const placeNumber = (position: number) => {
    if (currentNumber === null || placedNumbers[position - 1] !== null) return;

    // Check if the number can be placed at this position
    const isValidPlacement = isValidMove(position, currentNumber);

    if (isValidPlacement) {
      const newPlacedNumbers = [...placedNumbers];
      newPlacedNumbers[position - 1] = currentNumber;

      setPlacedNumbers(newPlacedNumbers);
      setUsedNumbers([...usedNumbers, currentNumber]);
      setScore(score + 1);

      // Generate next number
      generateNumber();

      toast({
        description: `Number ${currentNumber} placed in slot ${position}`,
        variant: "default",
      });
    } else {
      // Game over due to invalid placement
      setWrongMovePosition(position - 1);
      setGameOver(true);
      setIsWin(false);

      toast({
        title: "Invalid Move!",
        description: `Number ${currentNumber} can't be placed in slot ${position}`,
        variant: "destructive",
      });
    }
  };

  // Check if a move is valid
  const isValidMove = (position: number, number: number) => {
    const index = position - 1;

    // Check left neighbor (if exists)
    const leftNeighborValid = index === 0 ||
      placedNumbers[index - 1] === null ||
      placedNumbers[index - 1]! < number;

    // Check right neighbor (if exists)
    const rightNeighborValid = index === SLOTS - 1 ||
      placedNumbers[index + 1] === null ||
      placedNumbers[index + 1]! > number;

    return leftNeighborValid && rightNeighborValid;
  };

  // Reset the game
  const resetGame = () => {
    setPlacedNumbers(Array(SLOTS).fill(null));
    setUsedNumbers([]);
    setGameOver(false);
    setIsWin(false);
    setScore(0);
    setWrongMovePosition(null);
    generateNumber();
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <GameStatus
        gameOver={gameOver}
        isWin={isWin}
        score={score}
        onReset={resetGame}
      />

      <div className="my-8 p-6 bg-card rounded-lg shadow-sm">
        {!gameOver && currentNumber !== null && (
          <div className="mb-6 flex flex-col items-center">
            <span className="text-sm font-medium text-muted-foreground mb-2">Current Number</span>
            <div className="w-20 h-20 flex items-center justify-center bg-primary text-primary-foreground rounded-lg text-3xl font-bold animate-pulse-scale">
              {currentNumber}
            </div>
            <div className="mt-3 flex items-center text-muted-foreground">
              <span>Choose a position</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        )}

        <div className="grid grid-cols-5 md:grid-cols-10 gap-2 md:gap-4 xs:grid-cols-2 xs:gap-2">
          {placedNumbers.map((value, index) => (
            <NumberSlot
              key={index}
              position={index + 1}
              value={value}
              onSelect={placeNumber}
              isSelectable={!gameOver && value === null}
              isWrongMove={wrongMovePosition === index}
            />
          ))}
        </div>
      </div>

      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-medium mb-2">How to Play:</h3>
        <ul className="text-muted-foreground space-y-1 text-sm">
          <li>• Place each randomly generated number from 1 to 100 in one of the ten slots</li>
          <li>• Numbers must be in ascending order from left to right</li>
          <li>• Once a slot is filled, it cannot be changed</li>
          <li>• Game ends if you place a number that breaks the order</li>
          <li>• Win by successfully placing all 10 numbers</li>
        </ul>
      </div>
    </div>
  );
};

export default Game;
