import { Chessboard } from "react-chessboard";
import { useMemo } from "react";

interface ChessboardWrapperProps {
    fen: string;
    side?: "white" | "black";
    visualOnly?: boolean;
}

export function ChessboardWrapper({ fen, side = "white", visualOnly = true }: ChessboardWrapperProps) {
    // Board styling with muted dark theme colors
    const boardStyle = useMemo(() => ({
        borderRadius: "4px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    }), []);

    const darkSquareStyle = useMemo(() => ({ backgroundColor: "#3F3F46" }), []);
    const lightSquareStyle = useMemo(() => ({ backgroundColor: "#71717A" }), []);

    const wrapperClass = `w-full max-w-[400px] aspect-square select-none ${visualOnly ? "pointer-events-none" : ""}`;
    // Use an any-typed alias to avoid prop type mismatches across react-chessboard versions
    const AnyChessboard: any = Chessboard as unknown as any;

    return (
        <div className={wrapperClass}>
            <AnyChessboard
                position={fen}
                boardOrientation={side}
                arePiecesDraggable={!visualOnly}
                customDarkSquareStyle={darkSquareStyle}
                customLightSquareStyle={lightSquareStyle}
                customBoardStyle={boardStyle}
                animationDuration={200}
            />
        </div>
    );
}
