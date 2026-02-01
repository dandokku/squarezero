export interface Opening {
    id: string;
    name: string;
    fen: string; // The position after the opening moves
    side: "white" | "black"; // Which side plays the opening (usually we view from that side)
}

export const OPENINGS: Opening[] = [
    {
        id: "sicilian-defense",
        name: "Sicilian Defense",
        fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        side: "black",
    },
    {
        id: "ruy-lopez",
        name: "Ruy Lopez",
        fen: "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
        side: "white",
    },
    {
        id: "french-defense",
        name: "French Defense",
        fen: "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        side: "black",
    },
    {
        id: "queens-gambit",
        name: "Queen's Gambit",
        fen: "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
        side: "white",
    },
    {
        id: "kings-indian-defense",
        name: "King's Indian Defense",
        fen: "rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
        side: "black",
    },
    {
        id: "caro-kann",
        name: "Caro-Kann Defense",
        fen: "rnbqkbnr/pp1ppppp/2p5/4P3/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 2",
        side: "black",
    },
    {
        id: "london-system",
        name: "London System",
        fen: "rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/5N2/PPP1PPPP/RN1QKB1R b KQkq - 3 3",
        side: "white",
    }
];
