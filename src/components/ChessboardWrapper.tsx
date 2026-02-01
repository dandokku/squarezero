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
    const customDarkSquareStyle = { backgroundColor: "#262626" }; // Neutral charcoal
    const customLightSquareStyle = { backgroundColor: "#525252" }; // Muted grey for contrast (wait, light squares should be lighter?)

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
                position={fen}
                boardOrientation={side}
                arePiecesDraggable={!visualOnly}
                customDarkSquareStyle={{ backgroundColor: "#3F3F46" }} // Zinc 700
                customLightSquareStyle={{ backgroundColor: "#71717A" }} // Zinc 500
                // Let's try higher contrast for better visibility
                // Dark: #52525B (Zinc 600)
                // Light: #A1A1AA (Zinc 400)
                // Adjusting to a verified nice dark theme combo

                // Actually, let's stick to the "charcoal / off-white" suggestion
                // Charcoal: #36454F -> maybe #27272a (zinc-900 is too dark)
                // let's use:
                // Dark: #27272a (Zinc 800)
                // Light: #52525b (Zinc 600)

                customBoardStyle={boardStyle}
                animationDuration={200}
            />
        </div>
    );
}
