import { useState } from "react";
import { Link } from "react-router-dom";
import { OPENINGS } from "../lib/data";
import { ChessboardWrapper } from "../components/ChessboardWrapper.tsx";
import { Search } from "lucide-react";
import { cn } from "../lib/utils";

export function OpeningsList() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"All" | "Beginner" | "Intermediate" | "Advanced">("All");

    const filteredOpenings = OPENINGS.filter(opening => {
        const matchesSearch = opening.name.toLowerCase().includes(search.toLowerCase()) ||
            opening.eco.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === "All" || opening.difficulty === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Openings</h1>
                    <p className="text-muted-foreground mt-1">Select an opening to start practicing.</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search openings..."
                            className="w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        {/* Simple filer tabs for now */}
                        {(["All", "Beginner", "Intermediate", "Advanced"] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={cn(
                                    "px-3 py-1.5 rounded-md text-xs font-medium transition-colors border",
                                    filter === f
                                        ? "bg-secondary text-secondary-foreground border-secondary"
                                        : "bg-transparent text-muted-foreground border-transparent hover:bg-secondary/50 hover:text-foreground"
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOpenings.map((opening) => (
                    <Link
                        key={opening.id}
                        to={`/practice/${opening.id}`}
                        className="group relative overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow transition-all hover:shadow-md hover:border-primary/50"
                    >
                        <div className="w-full aspect-video bg-muted/20 relative flex items-center justify-center p-4">
                            {/* Small Board Preview - using specific styling to make it look "iconic" */}
                            <div className="w-48 h-48 opacity-90 transition-transform duration-500 group-hover:scale-105">
                                <ChessboardWrapper fen={opening.fen} side={opening.side} visualOnly={true} />
                            </div>

                            {/* Side Indicator */}
                            <div className="absolute top-3 right-3 px-2 py-1 rounded bg-background/80 backdrop-blur text-[10px] font-bold uppercase tracking-wider border border-border">
                                {opening.side}
                            </div>
                        </div>

                        <div className="p-5 space-y-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold tracking-tight text-lg group-hover:text-primary transition-colors">
                                        {opening.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground font-mono">{opening.eco}</p>
                                </div>
                                <div className={cn(
                                    "px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider",
                                    opening.difficulty === "Beginner" ? "bg-green-500/10 text-green-500" :
                                        opening.difficulty === "Intermediate" ? "bg-yellow-500/10 text-yellow-500" :
                                            "bg-red-500/10 text-red-500"
                                )}>
                                    {opening.difficulty}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}

                {filteredOpenings.length === 0 && (
                    <div className="col-span-full py-12 text-center text-muted-foreground">
                        No openings found matching your criteria.
                    </div>
                )}
            </div>
        </div>
    );
}
