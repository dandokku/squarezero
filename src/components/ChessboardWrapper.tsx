import { Chessboard as ReactChessboard } from "react-chessboard";
import { useMemo } from "react";

interface ChessboardWrapperProps {
    fen: string;
    side?: "white" | "black";
    visualOnly?: boolean;
}

export function ChessboardWrapper({ fen, side = "white", visualOnly = true }: ChessboardWrapperProps) {
    // Custom pieces or styling can be added here
    // For now, we use the default pieces but with a custom board style


    // Let's refine the board colors for a "premium dark mode" feel.
    // Dark squares: #262626 (Neutral 800)
    // Light squares: #404040 (Neutral 700) or maybe slightly lighter?
    // Actually, standard wooden board:
    // Dark: #B58863
    // Light: #F0D9B5

    // Requested: "Neutral colors (charcoal, off-white, muted wood tones)"
    // "Flat, modern board style"

    // Let's try a monochrome dark theme:
    // Dark: #171717 (Neutral 900)
    // Light: #262626 (Neutral 800)
    // This might be too dark.

    // Let's go with a muted "Linear" style:
    // Dark: #2B303B (Cool dark grey)
    // Light: #4F5666 (Lighter cool grey)

    // Or:
    const boardStyle = useMemo(() => ({
        borderRadius: "4px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    }), []);

    return (
        <div className="w-full max-w-[400px] aspect-square select-none pointer-events-none">
            <ReactChessboard
                {...({
                    position: fen,
                    boardOrientation: side,
                    arePiecesDraggable: !visualOnly,
                    customDarkSquareStyle: { backgroundColor: "#3F3F46" },
                    customLightSquareStyle: { backgroundColor: "#71717A" },
                    customBoardStyle: boardStyle,
                    animationDuration: 200
                } as any)}
            />
        </div>
    );
}
