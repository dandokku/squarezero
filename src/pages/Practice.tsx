import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { Chess, Square } from "chess.js";
import Chessground from "@bezalel6/react-chessground";
import { OPENINGS } from "../lib/data";
import { Button } from "../components/ui/button";
import { ArrowLeft, RotateCcw, HelpCircle, CheckCircle2 } from "lucide-react";
import { cn } from "../lib/utils";

// Define Move type for dests
type Dests = Map<Square, Square[]>;

export function Practice() {
    const { id } = useParams();
    const navigate = useNavigate();

    const opening = useMemo(() => OPENINGS.find((o) => o.id === id), [id]);

    // -- State for UI --
    const [game, setGame] = useState(new Chess());
    const [status, setStatus] = useState<"playing" | "completed" | "failed">("playing");
    const [message, setMessage] = useState<string>("Make your move!");
    const [orientation] = useState<"white" | "black">(opening?.side || "white");
    const [moveIndex, setMoveIndex] = useState(0);
    const [lastMove, setLastMove] = useState<Square[] | undefined>(undefined);

    // -- Refs for Logic (to avoid closure capture issues in Chessground) --
    const gameRef = useRef(new Chess());
    const moveIndexRef = useRef(0);
    const statusRef = useRef<"playing" | "completed" | "failed">("playing");

    // Sync refs with state when they change externally (like reset)
    useEffect(() => {
        gameRef.current = game;
        moveIndexRef.current = moveIndex;
        statusRef.current = status;
    }, [game, moveIndex, status]);

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

    // Calculate legal moves for Chessground
    const getDests = (chess: Chess): Dests => {
        const dests = new Map<Square, Square[]>();
        chess.moves({ verbose: true }).forEach((m) => {
            dests.set(m.from as Square, (dests.get(m.from as Square) || []).concat(m.to as Square));
        });
        return dests;
    };

    const makeComputerMove = useCallback(
        (currentGame: Chess, index: number) => {
            if (index >= moveSequence.length) return;

            const move = moveSequence[index];
            try {
                const result = currentGame.move(move.san || move.lan);
                if (result) {
                    const newGame = new Chess(currentGame.fen());
                    gameRef.current = newGame;
                    moveIndexRef.current = index + 1;

                    setGame(newGame);
                    setMoveIndex(index + 1);
                    setLastMove([result.from, result.to]);

                    if (index + 1 >= moveSequence.length) {
                        setStatus("completed");
                        statusRef.current = "completed";
                        setMessage("Practice complete! Well done.");
                    } else {
                        setMessage("Your turn!");
                    }
                }
            } catch (e) {
                console.error("Computer move failed", e);
            }
        },
        [moveSequence]
    );

    const resetGame = useCallback(() => {
        const newGame = new Chess();
        gameRef.current = newGame;
        moveIndexRef.current = 0;
        statusRef.current = "playing";

        setGame(newGame);
        setMoveIndex(0);
        setStatus("playing");
        setMessage(userColor === "white" ? "Make your move!" : "Waiting for computer...");
        setLastMove(undefined);

        if (userColor === "black" && moveSequence.length > 0) {
            setTimeout(() => {
                makeComputerMove(newGame, 0);
            }, 500);
        }
    }, [userColor, moveSequence, makeComputerMove]);

    useEffect(() => {
        resetGame();
    }, [resetGame]);

    const onMove = (from: any, to: any) => {
        // ALWAYS use Ref values here to avoid stale closures
        const currentStatus = statusRef.current;
        const currentMoveIndex = moveIndexRef.current;
        const currentGame = gameRef.current;

        if (currentStatus !== "playing") return;
        if (currentGame.turn() !== userTurnChar) return;

        try {
            // 1. Check if the move is legal in chess
            const tempGame = new Chess(currentGame.fen());
            const moveAttempt = tempGame.move({
                from: from as Square,
                to: to as Square,
                promotion: "q",
            });

            if (!moveAttempt) return;

            // 2. Check if the move is correct according to sequence
            const expectedMove = moveSequence[currentMoveIndex];
            if (!expectedMove) {
                setStatus("completed");
                statusRef.current = "completed";
                setMessage("Sequence finished!");
                return;
            }

            const isCorrectSquares = from === expectedMove.from && to === expectedMove.to;

            if (!isCorrectSquares) {
                setMessage(`Incorrect. The correct move was ${expectedMove.san}. Try again!`);
                // Revert board after a delay
                setTimeout(() => {
                    setGame(new Chess(currentGame.fen()));
                }, 500);
                return;
            }

            // 3. Apply Correct Move
            const nextGame = new Chess(currentGame.fen());
            nextGame.move({
                from: from as Square,
                to: to as Square,
                promotion: "q",
            });

            const nextIndex = currentMoveIndex + 1;
            gameRef.current = nextGame;
            moveIndexRef.current = nextIndex;

            setGame(nextGame);
            setMoveIndex(nextIndex);
            setMessage("Correct!");
            setLastMove([from as Square, to as Square]);

            if (nextIndex >= moveSequence.length) {
                setStatus("completed");
                statusRef.current = "completed";
                setMessage("Practice complete! Well done.");
            } else {
                // Trigger Computer Response
                setTimeout(() => {
                    makeComputerMove(nextGame, nextIndex);
                }, 500);
            }
        } catch (e) {
            console.error("Move processing error", e);
        }
    };

    const showHintHandler = () => {
        const nextMove = moveSequence[moveIndexRef.current];
        if (nextMove) {
            setMessage(`Hint: ${nextMove.san} (${nextMove.from} to ${nextMove.to})`);
        }
    };

    // Redirect if invalid ID
    if (!opening && id) {
        return <Navigate to="/" replace />;
    }
    if (!id) {
        return <Navigate to="/" replace />;
    }

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
                <div className="w-[100px]" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 w-full">
                {/* Chessboard */}
                <div className="lg:col-span-2 flex justify-center">
                    <div className="w-full max-w-[600px] aspect-square shadow-xl rounded-lg overflow-hidden border-4 border-muted">
                        <Chessground
                            fen={game.fen()}
                            orientation={orientation}
                            onMove={onMove}
                            movable={{
                                free: false,
                                color: userTurnChar === "w" ? "white" : "black",
                                dests: getDests(game),
                                showDests: true,
                            }}
                            lastMove={lastMove}
                            width="100%"
                            height="100%"
                            animation={{ enabled: true, duration: 250 }}
                        />
                    </div>
                </div>

                {/* Sidebar Controls */}
                <div className="lg:col-span-1 flex flex-col space-y-6">
                    <div
                        className={cn(
                            "p-6 rounded-xl border flex flex-col items-center text-center space-y-2 transition-colors min-h-[120px] justify-center",
                            status === "playing"
                                ? "bg-card border-border"
                                : status === "completed"
                                    ? "bg-green-500/10 border-green-500/50 text-green-700"
                                    : "bg-red-500/10 border-red-500/50 text-red-700"
                        )}
                    >
                        {status === "playing" && <div className="font-semibold text-lg">{message}</div>}
                        {status === "completed" && (
                            <>
                                <CheckCircle2 className="h-10 w-10 text-green-600 mb-2" />
                                <div className="font-bold text-xl uppercase tracking-tight">Completed!</div>
                                <p className="text-sm opacity-90">
                                    Great job! You've mastered this opening sequence.
                                </p>
                            </>
                        )}
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                            <span>Sequence Progress</span>
                            <span>
                                {moveSequence.length > 0
                                    ? Math.round((moveIndex / moveSequence.length) * 100)
                                    : 0}
                                %
                            </span>
                        </div>
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-300"
                                style={{
                                    width: `${moveSequence.length > 0 ? (moveIndex / moveSequence.length) * 100 : 0
                                        }%`,
                                }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground text-center pt-1">
                            Move {moveIndex} of {moveSequence.length}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant="outline"
                            onClick={showHintHandler}
                            disabled={status !== "playing"}
                            className="w-full"
                        >
                            <HelpCircle className="mr-2 h-4 w-4" /> Hint
                        </Button>
                        <Button variant="outline" onClick={resetGame} className="w-full">
                            <RotateCcw className="mr-2 h-4 w-4" /> Restart
                        </Button>
                    </div>

                    {/* Move History */}
                    <div className="bg-muted/30 rounded-lg p-4 flex-grow overflow-y-auto text-sm font-mono border border-border">
                        <div className="grid grid-cols-[30px_1fr_1fr] gap-x-4 gap-y-2">
                            <div className="text-muted-foreground font-bold border-b pb-1">#</div>
                            <div className="text-muted-foreground font-bold border-b pb-1 text-center">White</div>
                            <div className="text-muted-foreground font-bold border-b pb-1 text-center">Black</div>
                            {moveSequence.map((m, i) => {
                                if (i % 2 === 0) {
                                    const moveNum = Math.floor(i / 2) + 1;
                                    const whiteMove = m;
                                    const blackMove = moveSequence[i + 1];

                                    const isWhiteActive = i === moveIndex;
                                    const isBlackActive = i + 1 === moveIndex;
                                    const isDone = i < moveIndex;
                                    const isBlackDone = i + 1 < moveIndex;

                                    return (
                                        <div key={i} className="contents">
                                            <div className="text-muted-foreground">{moveNum}.</div>
                                            <div className={cn(
                                                "px-2 py-0.5 rounded text-center",
                                                isWhiteActive ? "bg-primary text-primary-foreground font-bold" :
                                                    isDone ? "text-foreground/70" : "text-muted-foreground/30"
                                            )}>
                                                {whiteMove.san}
                                            </div>
                                            <div className={cn(
                                                "px-2 py-0.5 rounded text-center",
                                                isBlackActive ? "bg-primary text-primary-foreground font-bold" :
                                                    isBlackDone ? "text-foreground/70" : "text-muted-foreground/30"
                                            )}>
                                                {blackMove?.san || ""}
                                            </div>
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
