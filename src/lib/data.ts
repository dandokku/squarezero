export interface Opening {
    id: string;
    name: string;
    eco: string; // Encyclopedia of Chess Openings code
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    fen: string; // The position after the opening moves
    side: "white" | "black"; // Which side plays the opening (usually we view from that side)
}

export const OPENINGS: Opening[] = [
    {
        id: "sicilian-defense",
        name: "Sicilian Defense",
        eco: "B20",
        difficulty: "Intermediate",
        fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2",
        side: "black",
    },
    {
        id: "ruy-lopez",
        name: "Ruy Lopez",
        eco: "C60",
        difficulty: "Intermediate",
        fen: "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
        side: "white",
    },
    {
        id: "french-defense",
        name: "French Defense",
        eco: "C00",
        difficulty: "Intermediate",
        fen: "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        side: "black",
    },
    {
        id: "queens-gambit",
        name: "Queen's Gambit",
        eco: "D06",
        difficulty: "Intermediate",
        fen: "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3 0 2",
        side: "white",
    },
    {
        id: "kings-indian-defense",
        name: "King's Indian Defense",
        eco: "E60",
        difficulty: "Advanced",
        fen: "rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 2 3",
        side: "black",
    },
    {
        id: "caro-kann",
        name: "Caro-Kann Defense",
        eco: "B10",
        difficulty: "Beginner",
        fen: "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        side: "black",
    },
    {
        id: "london-system",
        name: "London System",
        eco: "D02",
        difficulty: "Beginner",
        fen: "rnbqkbnr/ppp1pppp/8/3p4/3P1B2/8/PPP1PPPP/RN1QKBNR b KQkq - 1 2",
        side: "white",
    },
    {
        id: "scandinavian-defense",
        name: "Scandinavian Defense",
        eco: "B01",
        difficulty: "Beginner",
        fen: "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 2",
        side: "black",
    },
    {
        id: "italian-game",
        name: "Italian Game",
        eco: "C50",
        difficulty: "Beginner",
        fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
        side: "white",
    }
];

