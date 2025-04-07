import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveWinner } from "@/services/WinnerService";
import { useToast } from "@/hooks/use-toast";

interface WinnerDialogProps {
    isOpen: boolean;
    onClose: () => void;
    score: number;
}

const WinnerDialog: React.FC<WinnerDialogProps> = ({ isOpen, onClose, score }) => {
    const [name, setName] = useState("");
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast({
                title: "Name required",
                description: "Please enter your name to save your score",
                variant: "destructive",
            });
            return;
        }

        saveWinner(name, score);
        toast({
            title: "Score saved!",
            description: "Your winning score has been recorded",
        });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Congratulations!</DialogTitle>
                    <DialogDescription>
                        You won with a score of {score}. Enter your name to save your achievement.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="col-span-3"
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save score</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default WinnerDialog;