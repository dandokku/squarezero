import { useParams, Navigate, useNavigate } from "react-router-dom";
import { OPENINGS } from "../lib/data";
import { ChessboardWrapper } from "../components/ChessboardWrapper.tsx";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";

export function OpeningDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Find the opening by ID
    const opening = OPENINGS.find(o => o.id === id);

    // If opening not found, redirect to home
    if (!opening) {
        return <Navigate to="/" replace />;
    }

    const handleBack = () => {
        navigate("/");
    };

    return (
        <div className="space-y-8">
            {/* Header with back button */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={handleBack} className="gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to List
                </Button>
            </div>

            {/* Main content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left side: Opening information */}
                <div className="lg:col-span-1 space-y-6">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">{opening.name}</h1>
                        <p className="text-lg text-muted-foreground mt-2">ECO: {opening.eco}</p>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                                Difficulty
                            </h3>
                            <div
                                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                    opening.difficulty === "Beginner"
                                        ? "bg-green-500/10 text-green-500"
                                        : opening.difficulty === "Intermediate"
                                        ? "bg-yellow-500/10 text-yellow-500"
                                        : "bg-red-500/10 text-red-500"
                                }`}
                            >
                                {opening.difficulty}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                                Perspective
                            </h3>
                            <p className="text-foreground capitalize">{opening.side}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                                FEN String
                            </h3>
                            <p className="text-xs font-mono bg-background p-2 rounded border border-border text-muted-foreground break-all">
                                {opening.fen}
                            </p>
                        </div>
                    </div>

                    <Button onClick={() => navigate(`/practice/${opening.id}`)} className="w-full">
                        Start Practice
                    </Button>
                </div>

                {/* Right side: Chessboard */}
                <div className="lg:col-span-2 flex items-center justify-center">
                        <div className="w-full max-w-[500px]">
                            <ChessboardWrapper fen={opening.fen} side={opening.side} visualOnly={false} />
                            {/* Move sequence */}
                            {opening.moves && (
                                <div className="mt-4 bg-background p-3 rounded border border-border text-sm font-mono text-muted-foreground">
                                    {opening.moves}
                                </div>
                            )}
                        </div>
                </div>
            </div>
        </div>
    );
}
