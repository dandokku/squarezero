import { useState, useMemo, useEffect, useCallback } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { Chess, Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import { OPENINGS } from "../lib/data";
import { Button } from "../components/ui/button";
import { ArrowLeft, RotateCcw, HelpCircle, CheckCircle2 } from "lucide-react";
import { cn } from "../lib/utils";

// Define Arrow tuple type compatible with react-chessboard
type Arrow = [Square, Square, string?];

export function Practice() {
    const { id } = useParams();
    const navigate = useNavigate();

    const opening = useMemo(() => OPENINGS.find(o => o.id === id), [id]);

    // Redirect if invalid ID
    if (!opening && id) {
        return <Navigate to="/" replace />;
    }

    // If no ID, ideally we show a selection or random, but for now redirect
    if (!id) {
        return <Navigate to="/" replace />;
    }

    // -- State --
    const [game, setGame] = useState(new Chess());
    const [status, setStatus] = useState<"playing" | "completed" | "failed">("playing");
    const [message, setMessage] = useState<string>("");
    const [orientation, setOrientation] = useState<"white" | "black">("white");
    const [moveIndex, setMoveIndex] = useState(0);
    const [customArrows, setCustomArrows] = useState<Arrow[]>([]);

    // Memoize the target sequence of moves
    const moveSequence = useMemo(() => {
        if (!opening) return [];
        const tempGame = new Chess();
        try {
            tempGame.loadPgn(opening.moves || "");
            return tempGame.history({ verbose: true });
        } catch (e) {
            console.error("Failed to parse PGN:", e);
            return [];
        }
    }, [opening]);

    const userColor = opening?.side || "white";
    const userTurnChar = userColor === "white" ? "w" : "b";

    // -- Initialization --
    const makeComputerMove = useCallback((currentGame: Chess, index: number) => {
        if (index >= moveSequence.length) return;

        const move = moveSequence[index];
        const success = safeMakeMove(currentGame, move);
        if (success) {
            const newGame = new Chess(currentGame.fen());
            setGame(newGame);
            setMoveIndex(index + 1);

            // Check if sequence complete (if computer ends it?)
            if (index + 1 >= moveSequence.length) {
                setStatus("completed");
                setMessage("Practice complete! Well done.");
            }
        }
    }, [moveSequence]);

    const safeMakeMove = (gameInstance: Chess, move: { from: string, to: string, promotion?: string, san?: string } | string) => {
        try {
            if (typeof move === 'object' && 'san' in move && move.san) {
                return !!gameInstance.move(move.san as string);
            }
            return !!gameInstance.move(move);
        } catch (e) {
            return false;
        }
    };

    const resetGame = useCallback(() => {
        const newGame = new Chess();
        setGame(newGame);
        setMoveIndex(0);
        setStatus("playing");
        setMessage("Make your move!");
        setCustomArrows([]);
        setOrientation(userColor);

        // If user is Black, computer (White) makes first move immediately
        if (userColor === "black" && moveSequence.length > 0) {
            setTimeout(() => {
                makeComputerMove(newGame, 0);
            }, 500);
        }
    }, [userColor, moveSequence, makeComputerMove]);

    useEffect(() => {
        resetGame();
    }, [resetGame]);

    // -- Interaction --
    function onDrop(sourceSquare: Square, targetSquare: Square) {
        if (status === "completed" || status === "failed") return false;
        if (game.turn() !== userTurnChar) return false; // Not user's turn

        // 1. Validate move validity in Chess rules
        const tempGame = new Chess(game.fen());
        try {
            // We use verbose move to get SAN for comparison
            const moveAttempt = tempGame.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: "q",
            });
            if (!moveAttempt) return false; // Illegal chess move

            // 2. Validate against Opening Sequence
            const expectedMove = moveSequence[moveIndex];

            // If we ran out of moves, or it doesn't match
            if (!expectedMove) {
                setStatus("completed");
                setMessage("Sequence finished!");
                return false;
            }

            // Compare squares
            const isCorrectSquares = sourceSquare === expectedMove.from && targetSquare === expectedMove.to;

            if (!isCorrectSquares) {
                setMessage("Incorrect move. Try again!");
                return false;
            }

            // 3. Apply User Move
            const newGame = new Chess(game.fen());
            newGame.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: "q",
            });
            setGame(newGame);
            setMoveIndex(prev => prev + 1);
            setMessage("Correct!");
            setCustomArrows([]);

            // 4. Check if sequence finished
            if (moveIndex + 1 >= moveSequence.length) {
                setStatus("completed");
                setMessage("Practice complete! Well done.");
                return true;
            }

            // 5. Trigger Computer Response
            setTimeout(() => {
                const nextIndex = moveIndex + 1;
                // Computer move
                const g = new Chess(newGame.fen());
                makeComputerMove(g, nextIndex);
            }, 500);

            return true;
        } catch (e) {
            return false;
        }
    }

    const showHintHandler = () => {
        const nextMove = moveSequence[moveIndex];
        if (nextMove) {
            // Draw an arrow for the move
            setCustomArrows([[nextMove.from as Square, nextMove.to as Square]]);
        }
    };

    // Cast Chessboard to any to suppress faulty type definitions
    const Board = Chessboard as any;

    return (
        <div className="flex flex-col items-center max-w-4xl mx-auto w-full py-8 space-y-8 px-4">

            {/* Header */}
            <div className="w-full flex items-center justify-between border-b pb-4">
                <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to List
                </Button>
                <div className="text-center">
                    <h1 className="text-2xl font-bold">{opening?.name}</h1>
                    <p className="text-sm text-muted-foreground">{opening?.eco}</p>
                </div>
                <div className="w-[100px]" /> {/* Spacer for centering */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 w-full">
                {/* Chessboard */}
                <div className="lg:col-span-2 flex justify-center">
                    <div className="w-full max-w-[600px] aspect-square shadow-xl rounded-lg overflow-hidden border-4 border-muted">
                        <Board
                            position={game.fen()}
                            onPieceDrop={onDrop}
                            boardOrientation={orientation}
                            customArrows={customArrows}
                            areArrowsAllowed={true}
                            animationDuration={200}
                        />
                    </div>
                </div>

                {/* Sidebar Controls */}
                <div className="lg:col-span-1 flex flex-col space-y-6">

                    {/* Status Card */}
                    <div className={cn(
                        "p-6 rounded-xl border flex flex-col items-center text-center space-y-2 transition-colors",
                        status === "playing" ? "bg-card border-border" :
                            status === "completed" ? "bg-green-500/10 border-green-500/50 text-green-700" :
                                "bg-red-500/10 border-red-500/50 text-red-700"
                    )}>
                        {status === "playing" && <div className="font-semibold text-lg">{message}</div>}
                        {status === "completed" && (
                            <>
                                <CheckCircle2 className="h-12 w-12 text-green-600 mb-2" />
                                <div className="font-bold text-xl">Completed!</div>
                                <p className="text-sm opacity-90">You have successfully practiced this opening sequence.</p>
                            </>
                        )}
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                            <span>Progress</span>
                            <span>{moveSequence.length > 0 ? Math.round((moveIndex / moveSequence.length) * 100) : 0}%</span>
                        </div>
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-300"
                                style={{ width: `${moveSequence.length > 0 ? (moveIndex / moveSequence.length) * 100 : 0}%` }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground text-center pt-1">
                            Move {Math.ceil((moveIndex + 1) / 2)} of {Math.ceil(moveSequence.length / 2)}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-4 mt-auto">
                        <Button
                            variant="outline"
                            onClick={showHintHandler}
                            disabled={status !== "playing"}
                            className="w-full"
                        >
                            <HelpCircle className="mr-2 h-4 w-4" /> Hint
                        </Button>
                        <Button
                            variant="outline"
                            onClick={resetGame}
                            className="w-full"
                        >
                            <RotateCcw className="mr-2 h-4 w-4" /> Restart
                        </Button>
                    </div>

                    {/* Move History / Log */}
                    <div className="bg-muted/30 rounded-lg p-4 h-48 overflow-y-auto text-sm font-mono border border-border">
                        <div className="grid grid-cols-[30px_1fr_1fr] gap-y-1">
                            {moveSequence.map((m, i) => {
                                if (i % 2 === 0) {
                                    const moveNum = Math.floor(i / 2) + 1;
                                    const whiteMove = m;
                                    const blackMove = moveSequence[i + 1];

                                    const isNext = i === moveIndex || i + 1 === moveIndex;
                                    const isDone = i < moveIndex;

                                    return (
                                        <div key={i} className={cn("contents", isDone ? "text-muted-foreground" : isNext ? "text-foreground font-semibold" : "text-muted-foreground/50")}>
                                            <div className="text-muted-foreground">{moveNum}.</div>
                                            <div>{whiteMove.san}</div>
                                            <div>{blackMove?.san || ""}</div>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
