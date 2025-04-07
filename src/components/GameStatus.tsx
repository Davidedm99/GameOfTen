import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trophy } from "lucide-react";

interface GameStatusProps {
  gameOver: boolean;
  isWin: boolean;
  score: number;
  onReset: () => void;
}

const GameStatus: React.FC<GameStatusProps> = ({
  gameOver,
  isWin,
  score,
  onReset,
}) => {
  return (
    <div className={cn(
      "rounded-lg p-6 shadow-sm transition-all",
      gameOver ? "animate-fade-in" : "",
      isWin ? "bg-accent text-accent-foreground" : gameOver ? "bg-destructive/10" : "bg-secondary"
    )}>
      <div className="flex flex-col gap-3 items-center">
        {gameOver ? (
          <>
            <div className="flex items-center gap-2 text-2xl font-bold mb-2">
              {isWin ? (
                <>
                  <Trophy className="w-6 h-6" />
                  <span>You Win!</span>
                </>
              ) : (
                <span>Game Over!</span>
              )}
            </div>
            <p className="text-lg">
              {isWin
                ? "Congratulations! You've placed all numbers correctly."
                : `You placed ${score} number${score !== 1 ? "s" : ""}.`}
            </p>
          </>
        ) : (
          <>
            <h2 className="text-md text-center">
              Try to put ten numbers in a row in ascending order without knowing what comes next!
            </h2>
          </>
        )}

        {gameOver && (
          <Button
            onClick={onReset}
            className="mt-2"
            variant={isWin ? "secondary" : "default"}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default GameStatus;
