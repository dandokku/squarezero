import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ChessboardWrapper } from "./ChessboardWrapper";
import { cn } from "../lib/utils";

interface FlashcardProps {
    openingName: string;
    fen: string;
    side: "white" | "black";
    mode: "name-to-board" | "board-to-name";
    isFlipped: boolean;
    onFlip: () => void;
}

export function Flashcard({ openingName, fen, side, mode, isFlipped, onFlip }: FlashcardProps) {
    // Front content depends on mode
    // mode: "name-to-board" -> Front: Name, Back: Board
    // mode: "board-to-name" -> Front: Board, Back: Name

    const showBoardOnFront = mode === "board-to-name";

    return (
        <div className="group relative w-full max-w-md h-[500px] cursor-pointer perspective-1000" onClick={onFlip}>
            <motion.div
                className="relative w-full h-full preserve-3d transition-all duration-500"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Front Face */}
                <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center rounded-xl border border-border bg-card p-6 shadow-xl">
                    {showBoardOnFront ? (
                        <ChessboardWrapper fen={fen} side={side} />
                    ) : (
                        <div className="text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground">{openingName}</h2>
                            <p className="mt-4 text-sm text-muted-foreground">Tap to reveal position</p>
                        </div>
                    )}
                </div>

                {/* Back Face */}
                <div
                    className="absolute inset-0 backface-hidden flex flex-col items-center justify-center rounded-xl border border-border bg-card p-6 shadow-xl"
                    style={{ transform: "rotateY(180deg)" }}
                >
                    {!showBoardOnFront ? (
                        <ChessboardWrapper fen={fen} side={side} />
                    ) : (
                        <div className="text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground">{openingName}</h2>
                            <p className="mt-4 text-sm text-muted-foreground">Tap to hide</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
