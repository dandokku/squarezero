import { useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { Flashcard } from "../components/Flashcard.tsx";
import { Controls } from "../components/Controls.tsx";
import { ProgressBar } from "../components/ProgressBar.tsx"; // We might want a different progress indicator for single practice
import { OPENINGS } from "../lib/data";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";

export function Practice() {
    const { id } = useParams();
    const navigate = useNavigate();

    // If no ID is provided (e.g. /practice route directly), we could redirect to list or pick random.
    // For now, let's redirect to list if no ID, or handle the "all" mode if we want.
    // The user requirement says "Openings List... Selecting an opening navigates to its quiz".

    // Let's support a "Session Mode" if no ID (cycling through all) 
    // AND a "Focus Mode" if ID is present.

    const initialIndex = id ? OPENINGS.findIndex(o => o.id === id) : 0;

    if (initialIndex === -1 && id) {
        return <Navigate to="/" replace />;
    }

    const [currentCardIndex, setCurrentCardIndex] = useState(initialIndex);
    const [isFlipped, setIsFlipped] = useState(false);
    const [mode, setMode] = useState<"name-to-board" | "board-to-name">("name-to-board");
    // Placeholder for session stats usage
    const [sessionStats, setSessionStats] = useState({ correct: 0, wrong: 0 });

    // If focused on one opening, maybe we just keep testing that one opening? 
    // Or maybe valid variations? 
    // "Opening Quiz / Practice page... Dedicated page for practicing a selected opening".
    // Usually this means practicing variations. 
    // Since we only have ONE fen per opening in mock data, "Practicing" a single opening repeatedly is static.
    // To make it meaningful, let's assume we are just viewing that card for now, or maybe we simulate a "success" state after one card.

    // Actually, for "Practice", it implies repetition. 
    // Let's keep the single card focus for now, but maybe add a "Restart" or "Next Opening" flow?
    // If ID is set, we are in "Single Opening view".

    const handeBack = () => {
        navigate("/");
    };

    const currentOpening = OPENINGS[currentCardIndex];

    // If iterating through a list (when no ID was specific, or if we want to go next):
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const isFinished = !id && currentCardIndex >= OPENINGS.length;

    if (isFinished) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6">
                <h2 className="text-3xl font-bold">Session Complete</h2>
                <div className="grid grid-cols-2 gap-8 text-center">
                    <div>
                        <div className="text-4xl font-bold text-green-500">{sessionStats.correct}</div>
                        <div className="text-sm text-muted-foreground">Correct</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-red-500">{sessionStats.wrong}</div>
                        <div className="text-sm text-muted-foreground">Wrong</div>
                    </div>
                </div>
                <Button onClick={() => {
                    setCurrentCardIndex(0);
                    setSessionStats({ correct: 0, wrong: 0 });
                    setIsFlipped(false);
                }}>
                    Restart Session
                </Button>
                <Button variant="ghost" onClick={handeBack}>
                    Back to List
                </Button>
            </div>
        );
    }

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleResult = (correct: boolean) => {
        setSessionStats(prev => ({
            correct: prev.correct + (correct ? 1 : 0),
            wrong: prev.wrong + (!correct ? 1 : 0)
        }));

        setIsFlipped(false);

        if (id) {
            // If single opening practice, maybe just show a success message or stay?
            // Let's just reset flip to allow re-practice for now, essentially a "flashcard" study mode.
            // Or better yet, maybe navigate back to list or show "Good job"?
        } else {
            // Session mode
            setTimeout(() => {
                setCurrentCardIndex(prev => prev + 1);
            }, 200);
        }
    };



    return (
        <div className="flex flex-col items-center max-w-2xl mx-auto w-full py-8 space-y-8">

            {/* Navigation / Header for Practice */}
            <div className="w-full flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={handeBack} className="gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to List
                </Button>
                <div className="text-sm font-medium text-muted-foreground">
                    {id ? "Focus Practice" : `Card ${currentCardIndex + 1} / ${OPENINGS.length}`}
                </div>
            </div>

            <div className="w-full max-w-md flex flex-col items-center gap-8">
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
                    onToggleMode={() => setMode(prev => prev === "name-to-board" ? "board-to-name" : "name-to-board")}
                    onResult={handleResult}
                    isFlipped={isFlipped}
                    onFlip={handleFlip}
                />

                {/* Only show progress bar in session mode */}
                {!id && (
                    <div className="w-full mt-4">
                        <ProgressBar current={currentCardIndex} total={OPENINGS.length} />
                    </div>
                )}
            </div>
        </div>
    );
}
