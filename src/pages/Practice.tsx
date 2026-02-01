import { useState, useMemo, useEffect, useCallback } from "react";
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
    const [message, setMessage] = useState<string>("Make your move!");
    const [orientation] = useState<"white" | "black">(opening?.side || "white");
    const [moveIndex, setMoveIndex] = useState(0);
    const [lastMove, setLastMove] = useState<[string, string] | undefined>(undefined);

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

    // Calculate legal moves for Chessground
    const getDests = (chess: Chess): Dests => {
        const dests = new Map<Square, Square[]>();
        chess.moves({ verbose: true }).forEach((m) => {
            dests.set(m.from, (dests.get(m.from) || []).concat(m.to));
        });
        return dests;
    };

    // -- Computer Move logic --
    const makeComputerMove = useCallback(
        (currentGame: Chess, index: number) => {
            if (index >= moveSequence.length) return;

            const move = moveSequence[index];
            try {
                const result = currentGame.move(move.san || move.lan);
                if (result) {
                    const newGame = new Chess(currentGame.fen());
                    setGame(newGame);
                    setMoveIndex(index + 1);
                    setLastMove([result.from, result.to]);

                    if (index + 1 >= moveSequence.length) {
                        setStatus("completed");
                        setMessage("Practice complete! Well done.");
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
        setGame(newGame);
        setMoveIndex(0);
        setStatus("playing");
        setMessage("Make your move!");
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

    // -- Interaction --
    const onMove = (from: string, to: string) => {
        if (status !== "playing") return;
        if (game.turn() !== userTurnChar) return;

        const tempGame = new Chess(game.fen());
        try {
            const moveAttempt = tempGame.move({
                from: from as Square,
                to: to as Square,
                promotion: "q",
            });

            if (!moveAttempt) return;

            const expectedMove = moveSequence[moveIndex];
            if (!expectedMove) {
                setStatus("completed");
                setMessage("Sequence finished!");
                return;
            }

            const isCorrectSquares = from === expectedMove.from && to === expectedMove.to;

            if (!isCorrectSquares) {
                setMessage("Incorrect move. Try again!");
                // We need to revert the board state in Chessground
                // Since Chessground is controlled by FEN, setting game state back triggers it
                setTimeout(() => {
                    setGame(new Chess(game.fen()));
                }, 300);
                return;
            }

            // Correct move
            const newGame = new Chess(game.fen());
            newGame.move({
                from: from as Square,
                to: to as Square,
                promotion: "q",
            });
            setGame(newGame);
            setMoveIndex((prev) => prev + 1);
            setMessage("Correct!");
            setLastMove([from, to]);

            if (moveIndex + 1 >= moveSequence.length) {
                setStatus("completed");
                setMessage("Practice complete! Well done.");
            } else {
                setTimeout(() => {
                    makeComputerMove(newGame, moveIndex + 1);
                }, 500);
            }
        } catch (e) {
            console.error("Move error", e);
        }
    };

    const showHintHandler = () => {
        const nextMove = moveSequence[moveIndex];
        if (nextMove) {
            setMessage(`Hint: Move your piece to ${nextMove.to}`);
            // In Chessground we can't easily draw arrows without internal API calls or specific props
            // For now we just update the message
        }
    };

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
                        />
                    </div>
                </div>

                {/* Sidebar Controls */}
                <div className="lg:col-span-1 flex flex-col space-y-6">
                    <div
                        className={cn(
                            "p-6 rounded-xl border flex flex-col items-center text-center space-y-2 transition-colors",
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
                                <CheckCircle2 className="h-12 w-12 text-green-600 mb-2" />
                                <div className="font-bold text-xl">Completed!</div>
                                <p className="text-sm opacity-90">
                                    You have successfully practiced this opening sequence.
                                </p>
                            </>
                        )}
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                            <span>Progress</span>
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
                            Move {Math.ceil((moveIndex + 1) / 2)} of {Math.ceil(moveSequence.length / 2)}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-auto">
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
                                        <div
                                            key={i}
                                            className={cn(
                                                "contents",
                                                isDone
                                                    ? "text-muted-foreground"
                                                    : isNext
                                                        ? "text-foreground font-semibold"
                                                        : "text-muted-foreground/50"
                                            )}
                                        >
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
