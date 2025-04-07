// Interface for winner data
export interface Winner {
    name: string;
    date: string;
    score: number;
}

const WINNERS_KEY = 'number-game-winners';

// Save a winner to local storage
export const saveWinner = (name: string, score: number): void => {
    const winners = getWinners();

    const newWinner: Winner = {
        name,
        date: new Date().toISOString(),
        score,
    };

    winners.push(newWinner);
    localStorage.setItem(WINNERS_KEY, JSON.stringify(winners));
};

// Get all winners from local storage
export const getWinners = (): Winner[] => {
    const winnersJson = localStorage.getItem(WINNERS_KEY);
    if (!winnersJson) return [];

    try {
        return JSON.parse(winnersJson);
    } catch (error) {
        console.error('Failed to parse winners from storage:', error);
        return [];
    }
};

// Export winners to a text file
export const exportWinnersToFile = (): void => {
    const winners = getWinners();
    if (winners.length === 0) return;

    const content = winners.map(w =>
        `Name: ${w.name}, Date: ${new Date(w.date).toLocaleString()}, Score: ${w.score}`
    ).join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'number-game-winners.txt';
    document.body.appendChild(a);
    a.click();

    // Clean up
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
};

// Import winners from a text file (basic implementation)
export const importWinnersFromFile = async (file: File): Promise<Winner[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const text = event.target?.result as string;
                const lines = text.split('\n');

                const winners: Winner[] = lines.map(line => {
                    const nameMatch = line.match(/Name: (.*?),/);
                    const dateMatch = line.match(/Date: (.*?),/);
                    const scoreMatch = line.match(/Score: (\d+)/);

                    return {
                        name: nameMatch?.[1] || 'Unknown',
                        date: dateMatch?.[1] ? new Date(dateMatch[1]).toISOString() : new Date().toISOString(),
                        score: scoreMatch?.[1] ? parseInt(scoreMatch[1]) : 0
                    };
                });

                resolve(winners);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
};