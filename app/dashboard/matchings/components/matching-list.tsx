"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Matching, MatchingStatus } from "@/lib/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface MatchingListProps {
    matchings: Matching[];
}

const statusMap: Record<MatchingStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
    requested: { label: "Demandé", variant: "outline" },
    open: { label: "Ouvert", variant: "secondary" },
    confirmed: { label: "Confirmé", variant: "default" },
    refused: { label: "Refusé", variant: "destructive" },
    continued: { label: "Outline", variant: "outline" },
};

export function MatchingList({ matchings }: MatchingListProps) {
    const formatDate = (timestamp: any) => {
        if (!timestamp) return "-";
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return format(date, "P HH:mm", { locale: fr });
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Apprenant</TableHead>
                        <TableHead>Tuteur</TableHead>
                        <TableHead>Date Contact</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Confirmations</TableHead>
                        <TableHead>Accepté le</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {matchings.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                Aucun matching trouvé.
                            </TableCell>
                        </TableRow>
                    ) : (
                        matchings.map((matching) => (
                            <TableRow key={matching.id}>
                                <TableCell className="font-medium">{matching.learnerName || "Inconnu"}</TableCell>
                                <TableCell>{matching.tutorName || "Inconnu"}</TableCell>
                                <TableCell>{formatDate(matching.contactDate)}</TableCell>
                                <TableCell>
                                    <Badge variant={statusMap[matching.status]?.variant || "outline"}>
                                        {statusMap[matching.status]?.label || matching.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Badge variant={matching.learnerConfirmed ? "default" : "secondary"}>
                                            L: {matching.learnerConfirmed ? "OK" : "Non"}
                                        </Badge>
                                        <Badge variant={matching.tutorConfirmed ? "default" : "secondary"}>
                                            T: {matching.tutorConfirmed ? "OK" : "Non"}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell>{formatDate(matching.acceptedAt)}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
