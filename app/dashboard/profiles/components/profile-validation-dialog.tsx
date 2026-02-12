"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tutor, VerificationStatus } from "@/lib/types";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface ProfileValidationDialogProps {
    tutor: Tutor | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (uid: string, status: VerificationStatus, message: string) => void;
}

export function ProfileValidationDialog({ tutor, isOpen, onOpenChange, onConfirm }: ProfileValidationDialogProps) {
    const [message, setMessage] = useState("");
    const [isConfirmingReject, setIsConfirmingReject] = useState(false);

    if (!tutor) return null;

    const handleValidate = () => {
        onConfirm(tutor.uid, "verified", message);
        onOpenChange(false);
        setMessage("");
    };

    const handleReject = () => {
        onConfirm(tutor.uid, "rejected", message);
        onOpenChange(false);
        setMessage("");
        setIsConfirmingReject(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            onOpenChange(open);
            if (!open) {
                setIsConfirmingReject(false);
                setMessage("");
            }
        }}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {isConfirmingReject ? (
                            <><AlertCircle className="h-5 w-5 text-red-500" /> Confirm Rejection</>
                        ) : (
                            <><CheckCircle className="h-5 w-5 text-emerald-500" /> Validate Profile</>
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        {isConfirmingReject
                            ? `Are you sure you want to reject ${tutor.displayName}'s profile? Please provide a reason below.`
                            : `Reviewing ${tutor.displayName}'s profile for verification.`}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="message">
                            Feedback Message {isConfirmingReject && <span className="text-red-500">*</span>}
                        </Label>
                        <Textarea
                            id="message"
                            placeholder={isConfirmingReject ? "Explain why this profile was rejected..." : "Add an optional welcome message or verification note..."}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    {!isConfirmingReject ? (
                        <>
                            <Button variant="ghost" onClick={() => setIsConfirmingReject(true)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                <XCircle className="mr-2 h-4 w-4" /> Reject
                            </Button>
                            <Button onClick={handleValidate} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                <CheckCircle className="mr-2 h-4 w-4" /> Validate Profile
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" onClick={() => setIsConfirmingReject(false)}>Back</Button>
                            <Button variant="destructive" onClick={handleReject} disabled={!message.trim()}>
                                Confirm Rejection
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
