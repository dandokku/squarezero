import { Outlet, NavLink } from "react-router-dom";
import { BookOpen, Swords } from "lucide-react";
import { cn } from "../lib/utils";

export function Layout() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-14 items-center px-4 max-w-6xl">
                    <div className="mr-8 flex items-center gap-2 font-bold tracking-tight">
                        <div className="h-6 w-6 bg-foreground rounded-sm" /> {/* Simple Logo */}
                        <span>SquareZero</span>
                    </div>

                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <NavLink
                            to="/"
                            className={({ isActive }) => cn(
                                "transition-colors hover:text-foreground/80 flex items-center gap-2",
                                isActive ? "text-foreground" : "text-foreground/60"
                            )}
                        >
                            <BookOpen className="h-4 w-4" />
                            Openings
                        </NavLink>
                        <NavLink
                            to="/practice"
                            className={({ isActive }) => cn(
                                "transition-colors hover:text-foreground/80 flex items-center gap-2",
                                isActive ? "text-foreground" : "text-foreground/60"
                            )}
                        >
                            <Swords className="h-4 w-4" />
                            Practice
                        </NavLink>
                        <div className="px-2 py-1 bg-secondary/50 rounded text-xs text-muted-foreground ml-2">
                            Beta
                        </div>
                        {/* 
            <NavLink 
              to="/progress" 
              className={({ isActive }) => cn(
                "transition-colors hover:text-foreground/80 flex items-center gap-2",
                isActive ? "text-foreground" : "text-foreground/60"
              )}
            >
              <Trophy className="h-4 w-4" />
              Progress
            </NavLink>
            */}
                    </nav>

                    <div className="ml-auto flex items-center space-x-4">
                        {/* User or settings placeholder */}
                        <div className="h-8 w-8 rounded-full bg-secondary" />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto max-w-6xl px-4 py-8">
                <Outlet />
            </main>

            {/* Footer (Optional) */}
            <footer className="border-t border-border py-6 md:py-0">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row max-w-6xl px-4">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Built for serious chess improvement.
                    </p>
                </div>
            </footer>
        </div>
    );
}
