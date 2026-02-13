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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EngagedUser } from "@/lib/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface EngagedUsersListProps {
    users: EngagedUser[];
}

export function EngagedUsersList({ users }: EngagedUsersListProps) {
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
                        <TableHead>Utilisateur</TableHead>
                        <TableHead>Rôle</TableHead>
                        <TableHead>Dernière Activité</TableHead>
                        <TableHead className="text-center">Matchs</TableHead>
                        <TableHead className="text-center">Messages</TableHead>
                        <TableHead>Statut</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                Aucun utilisateur engagé trouvé.
                            </TableCell>
                        </TableRow>
                    ) : (
                        users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.photoURL || "/placeholder.svg"} alt={user.displayName} />
                                            <AvatarFallback>{user.displayName[0]?.toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{user.displayName}</span>
                                            <span className="text-xs text-muted-foreground">{user.email}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="capitalize">
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>{formatDate(user.lastActive)}</TableCell>
                                <TableCell className="text-center font-medium">{user.matchCount}</TableCell>
                                <TableCell className="text-center font-medium">{user.messageCount}</TableCell>
                                <TableCell>
                                    <Badge variant={user.status === "active" ? "default" : "secondary"}>
                                        {user.status === "active" ? "En ligne" : "Inactif"}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
