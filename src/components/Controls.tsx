import { Button } from "./ui/button";
import { ArrowLeftRight, Check, X } from "lucide-react";

interface ControlsProps {
    mode: "name-to-board" | "board-to-name";
    onToggleMode: () => void;
    onResult: (correct: boolean) => void;
    isFlipped: boolean;
    onFlip: () => void;
}

export function Controls({ mode, onToggleMode, onResult, isFlipped, onFlip }: ControlsProps) {
    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-md">
            {/* Mode Toggle */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className={mode === "name-to-board" ? "text-foreground font-medium" : ""}>Name → Board</span>
                <Button variant="ghost" size="icon" onClick={onToggleMode} className="h-8 w-8 hover:bg-muted">
                    <ArrowLeftRight className="h-4 w-4" />
                </Button>
                <span className={mode === "board-to-name" ? "text-foreground font-medium" : ""}>Board → Name</span>
            </div>

            {/* Action Buttons - Only visible when flipped? Or always?
          Usually flashcards show "Show Answer" then "Rate Answer".
          Let's assume:
          - If not flipped: "Show Answer" (Action)
          - If flipped: "Correct" / "Wrong"
       */}
            <div className="flex items-center justify-center gap-4 w-full h-12">
                {!isFlipped ? (
                    <Button onClick={onFlip} variant="secondary" className="w-full">
                        Show Answer <span className="ml-2 text-muted-foreground text-xs">(Space)</span>
                    </Button>
                ) : (
                    <>
                        <Button
                            onClick={() => onResult(false)}
                            variant="destructive"
                            className="flex-1 bg-red-900/30 text-red-400 hover:bg-red-900/50 hover:text-red-300 border border-red-900/50"
                        >
                            <X className="mr-2 h-4 w-4" /> Wrong <span className="ml-2 opacity-50 text-xs">(1)</span>
                        </Button>
                        <Button
                            onClick={() => onResult(true)}
                            className="flex-1 bg-green-900/30 text-green-400 hover:bg-green-900/50 hover:text-green-300 border border-green-900/50"
                        >
                            <Check className="mr-2 h-4 w-4" /> Correct <span className="ml-2 opacity-50 text-xs">(2)</span>
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
