import { useState } from "react";
import { Flashcard } from "./components/Flashcard.tsx";
import { Controls } from "./components/Controls.tsx";
import { ProgressBar } from "./components/ProgressBar.tsx";
import { OPENINGS, Opening } from "./lib/data";
import { Button } from "./components/ui/button";
import { RotateCw } from "lucide-react";

function App() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mode, setMode] = useState<"name-to-board" | "board-to-name">("name-to-board");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sessionStats, setSessionStats] = useState({ correct: 0, wrong: 0 });

  const currentOpening: Opening = OPENINGS[currentCardIndex];
  const isFinished = currentCardIndex >= OPENINGS.length;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleResult = (correct: boolean) => {
    setSessionStats(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      wrong: prev.wrong + (!correct ? 1 : 0)
    }));

    // Move to next card after a short delay
    setTimeout(() => {
      setIsFlipped(false);
      setCurrentCardIndex(prev => prev + 1);
    }, 200);
  };

  const handleRestart = () => {
    setCurrentCardIndex(0);
    setSessionStats({ correct: 0, wrong: 0 });
    setIsFlipped(false);
  };

  const handleToggleMode = () => {
    setMode(prev => prev === "name-to-board" ? "board-to-name" : "name-to-board");
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md w-full">
          <h1 className="text-4xl font-bold tracking-tight">Session Complete</h1>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-lg p-6 flex flex-col items-center">
              <span className="text-4xl font-bold text-green-500">{sessionStats.correct}</span>
              <span className="text-sm text-muted-foreground mt-2">Correct</span>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 flex flex-col items-center">
              <span className="text-4xl font-bold text-red-500">{sessionStats.wrong}</span>
              <span className="text-sm text-muted-foreground mt-2">Wrong</span>
            </div>
          </div>
          <Button onClick={handleRestart} className="w-full" size="lg">
            <RotateCw className="mr-2 h-4 w-4" /> Start New Session
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900/40 via-background to-background pointer-events-none" />

      <header className="absolute top-6 w-full max-w-4xl flex justify-between items-center px-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 bg-foreground rounded-sm" /> {/* Logo placeholder */}
          <span className="font-bold tracking-tighter text-lg">SquareZero</span>
        </div>
        <div className="text-sm text-muted-foreground font-medium">
          {currentCardIndex + 1} / {OPENINGS.length}
        </div>
      </header>

      <main className="z-10 w-full max-w-md flex flex-col items-center gap-8">
        <Flashcard
          openingName={currentOpening.name}
          fen={currentOpening.fen}
          side={currentOpening.side}
          mode={mode}
          isFlipped={isFlipped}
          onFlip={handleFlip}
        />

        <Controls
          mode={mode}
          onToggleMode={handleToggleMode}
          onResult={handleResult}
          isFlipped={isFlipped}
          onFlip={handleFlip}
        />

        <div className="w-full mt-4">
          <ProgressBar current={currentCardIndex} total={OPENINGS.length} />
        </div>
      </main>
    </div>
  );
}

export default App;
