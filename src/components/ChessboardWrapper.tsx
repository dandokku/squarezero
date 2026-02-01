import Chessground from "@bezalel6/react-chessground";
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

  // Validate FEN and derive orientation
  const validatedData = useMemo(() => {
    const chess = new Chess();
    try {
      if (fen !== "start") {
        chess.load(fen);
      }

      const orientation = side || (chess.turn() === 'w' ? 'white' : 'black');

      return {
        fen: fen === "start" ? "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" : chess.fen(),
        orientation: orientation as "white" | "black",
        isValid: true
      };
    } catch (e) {
      return {
        fen: fen,
        orientation: (side || "white") as "white" | "black",
        isValid: fen.includes('/')
      };
    }
  }, [fen, side]);

  if (!validatedData.isValid && fen !== "start") {
    return (
      <div className="w-full aspect-square bg-muted flex flex-col items-center justify-center text-[10px] text-muted-foreground p-4 text-center">
        <span>Invalid Position</span>
        <span className="font-mono mt-1 opacity-50 truncate w-full">{fen}</span>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-[400px] aspect-square ${visualOnly ? "pointer-events-none" : ""}`}>
      <Chessground
        fen={validatedData.fen}
        orientation={validatedData.orientation}
        viewOnly={visualOnly}
        animation={{ enabled: !visualOnly, duration: 300 }}
        width="100%"
        height="100%"
      />
    </div>
  );
}
