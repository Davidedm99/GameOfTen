import React from "react";
import { Link } from "react-router-dom";
import Game from "@/components/Game";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Game Of Ten</h1>
          </div>
          <Link to="/winners">
            <Button variant="outline" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Hall of Fame</span>
            </Button>
          </Link>
        </header>

        <main>
          <Game />
        </main>

        <footer className="mt-10 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Game of Ten </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
