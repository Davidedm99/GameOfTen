import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getWinners, exportWinnersToFile, importWinnersFromFile, Winner } from "@/services/WinnerService";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Download, Upload } from "lucide-react";

const Winners = () => {
    const [winners, setWinners] = useState<Winner[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        // Load winners on component mount
        setWinners(getWinners());
    }, []);

    const handleExport = () => {
        if (winners.length === 0) {
            toast({
                title: "No winners to export",
                description: "Play the game and win to add winners to the list.",
                variant: "destructive",
            });
            return;
        }

        exportWinnersToFile();
        toast({
            title: "Winners exported",
            description: "Winners have been exported to a text file.",
        });
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const importedWinners = await importWinnersFromFile(file);

            // Merge with existing winners (avoiding duplicates would require more complex logic)
            const allWinners = [...winners, ...importedWinners];
            setWinners(allWinners);

            // Save to local storage
            localStorage.setItem('number-game-winners', JSON.stringify(allWinners));

            toast({
                title: "Winners imported",
                description: `Successfully imported ${importedWinners.length} winners.`,
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Import failed",
                description: "Failed to import winners from file.",
                variant: "destructive",
            });
        }

        // Reset the input
        e.target.value = '';
    };

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <header className="flex items-center mb-8 justify-between">
                    <Link to="/" className="mr-4 shrink-0">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="flex-1 pl-16 sm:pl-64">
                        <h1 className="text-3xl font-bold sm:pl-12">Hall of Fame</h1>
                    </div>
                </header>

                <main>
                    <div className="flex justify-center items-center mb-6">
                        <h2 className="text-xl font-semibold text-center">Winners List</h2>
                    </div>

                    {winners.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Score</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {winners.map((winner, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{winner.name}</TableCell>
                                        <TableCell>{new Date(winner.date).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">{winner.score}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-10 border rounded-lg bg-muted/20">
                            <p className="text-muted-foreground">No winners yet. Be the first one!</p>
                            <Link to="/">
                                <Button variant="outline" className="mt-4">
                                    Play the game
                                </Button>
                            </Link>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Winners;