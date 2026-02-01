import { Chessboard } from "react-chessboard";
import { useMemo } from "react";
import { Chess } from "chess.js";

interface ChessboardWrapperProps {
  fen: string;
  side?: "white" | "black";
  visualOnly?: boolean;
}

export function ChessboardWrapper({
  fen,
  side,
  visualOnly = true,
}: ChessboardWrapperProps) {

  // Validate FEN and optionally derive side
  const validatedData = useMemo(() => {
    // If it's a special string like "start", it's valid for react-chessboard
    if (fen === "start") {
      return { fen: "start", orientation: (side || "white") as "white" | "black", isValid: true };
    }

    const chess = new Chess();
    try {
      // In some chess.js versions, load returns boolean, in others it might throw or return void.
      chess.load(fen);

      // If side is not provided, derive from active turn
      const orientation = side || (chess.turn() === 'w' ? 'white' : 'black');

      return {
        fen: chess.fen(),
        orientation: orientation as "white" | "black",
        isValid: true
      };
    } catch (e) {
      console.error("Error validating FEN:", e, fen);
      // If it fails, maybe it's just a position string (pieces only). 
      // Chessboard can often handle those directly, but chess.js might not.
      return {
        fen: fen,
        orientation: (side || "white") as "white" | "black",
        isValid: fen.includes('/') // Simple check for piece layout
      };
    }
  }, [fen, side]);

  const boardStyle = useMemo(() => ({
    borderRadius: "4px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
  }), []);

  if (!validatedData.isValid && fen !== "start") {
    return (
      <div className="w-full aspect-square bg-muted flex flex-col items-center justify-center text-[10px] text-muted-foreground p-4 text-center">
        <span>Invalid Position</span>
        <span className="font-mono mt-1 opacity-50 truncate w-full">{fen}</span>
      </div>
    );
  }

  // Cast to any to bypass potential type mismatch in lib definitions
  const CustomChessboard = Chessboard as any;

  return (
    <div className={`w-full max-w-[400px] aspect-square ${visualOnly ? "pointer-events-none" : ""}`}>
      <CustomChessboard
        position={validatedData.fen}
        boardOrientation={validatedData.orientation}
        arePiecesDraggable={!visualOnly}
        customDarkSquareStyle={{ backgroundColor: "#3F3F46" }}
        customLightSquareStyle={{ backgroundColor: "#71717A" }}
        customBoardStyle={boardStyle}
        animationDuration={visualOnly ? 0 : 300}
      />
    </div>
  );
}
