export interface Opening {
    id: string;
    name: string;
    eco: string; // Encyclopedia of Chess Openings code
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    fen: string; // The position for preview (turn matches side)
    side: "white" | "black"; // Which side plays the opening
    moves: string; // Full move sequence for practice
}

export const OPENINGS: Opening[] = [
    {
        "id": "sicilian-defense",
        "name": "Sicilian Defense",
        "eco": "B20",
        "difficulty": "Intermediate",
        "moves": "1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6",
        "side": "black",
        "fen": "rnbqkbnr/pp2pppp/3p4/8/3NP3/8/PPP2PPP/RNBQKB1R b KQkq - 0 4"
    },
    {
        "id": "ruy-lopez",
        "name": "Ruy Lopez",
        "eco": "C60",
        "difficulty": "Intermediate",
        "moves": "1.e4 e5 2.Nf3 Nc6 3.Bb5 a6",
        "side": "white",
        "fen": "r1bqkbnr/1ppp1ppp/p1n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4"
    },
    {
        "id": "french-defense",
        "name": "French Defense",
        "eco": "C00",
        "difficulty": "Intermediate",
        "moves": "1.e4 e6 2.d4 d5",
        "side": "black",
        "fen": "rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2"
    },
    {
        "id": "queens-gambit",
        "name": "Queen's Gambit",
        "eco": "D06",
        "difficulty": "Intermediate",
        "moves": "1.d4 d5 2.c4",
        "side": "white",
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2"
    },
    {
        "id": "kings-indian-defense",
        "name": "King's Indian Defense",
        "eco": "E60",
        "difficulty": "Advanced",
        "moves": "1.d4 Nf6 2.c4 g6 3.Nc3 Bg7",
        "side": "black",
        "fen": "rnbqkb1r/pppppp1p/5np1/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 1 3"
    },
    {
        "id": "caro-kann",
        "name": "Caro-Kann Defense",
        "eco": "B10",
        "difficulty": "Beginner",
        "moves": "1.e4 c6 2.d4 d5",
        "side": "black",
        "fen": "rnbqkbnr/pp1ppppp/2p5/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2"
    },
    {
        "id": "london-system",
        "name": "London System",
        "eco": "D02",
        "difficulty": "Beginner",
        "moves": "1.d4 d5 2.Bf4",
        "side": "white",
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2"
    },
    {
        "id": "scandinavian-defense",
        "name": "Scandinavian Defense",
        "eco": "B01",
        "difficulty": "Beginner",
        "moves": "1.e4 d5",
        "side": "black",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1"
    },
    {
        "id": "italian-game",
        "name": "Italian Game",
        "eco": "C50",
        "difficulty": "Beginner",
        "moves": "1.e4 e5 2.Nf3 Nc6 3.Bc4",
        "side": "white",
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3"
    }
];
