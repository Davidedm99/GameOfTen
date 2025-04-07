import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NumberSlotProps {
  position: number;
  value: number | null;
  onSelect: (position: number) => void;
  isSelectable: boolean;
  isWrongMove: boolean;
}

const NumberSlot: React.FC<NumberSlotProps> = ({
  position,
  value,
  onSelect,
  isSelectable,
  isWrongMove,
}) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-sm font-medium text-muted-foreground">Slot {position}</div>
      {value !== null ? (
        <div
          className={cn(
            "w-14 h-14 text-sm sm:w-16 sm:h-16 flex items-center justify-center rounded-lg sm:text-xl font-bold transition-all",
            isWrongMove
              ? "bg-destructive text-destructive-foreground animate-pulse-scale"
              : "bg-primary text-primary-foreground animate-fade-in"
          )}
        >
          {value}
        </div>
      ) : (
        <Button
          variant="outline"
          className={cn(
            "w-14 h-14 text-sm sm:w-16 sm:h-16 sm:text-lg font-medium transition-all",
            isSelectable
              ? "border-dashed border-primary hover:border-primary hover:bg-primary/10 animate-pulse-scale"
              : "border-muted cursor-not-allowed opacity-50"
          )}
          onClick={() => isSelectable && onSelect(position)}
          disabled={!isSelectable}
        >
          {position}
        </Button>

      )}
    </div>
  );
};

export default NumberSlot;
