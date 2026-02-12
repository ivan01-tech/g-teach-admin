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
import { Button } from "@/components/ui/button";
import { Tutor } from "@/lib/types";
import { Eye, CheckCircle, XCircle, Trash2, MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

interface ProfileTableProps {
    tutors: Tutor[];
    loading: boolean;
    onView: (tutor: Tutor) => void;
    onValidate: (tutor: Tutor) => void;
    onDelete: (uid: string) => void;
}

export function ProfileTable({ tutors, loading, onView, onValidate, onDelete }: ProfileTableProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "verified":
                return <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">Verified</Badge>;
            case "rejected":
                return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">Rejected</Badge>;
            default:
                return <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20">Pending</Badge>;
        }
    };

    if (loading) {
        return <div className="flex h-32 items-center justify-center">Loading tutors...</div>;
    }

    return (
        <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-slate-200 dark:border-slate-800">
                        <TableHead className="w-[250px]">Tutor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Specializations</TableHead>
                        <TableHead>Hourly Rate</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tutors.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                No tutors found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        tutors.map((tutor) => (
                            <TableRow key={tutor.uid} className="group border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-800">
                                            <AvatarImage src={tutor.photoURL} alt={tutor.displayName} />
                                            <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                                {tutor.displayName?.charAt(0) || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-900 dark:text-slate-100">{tutor.displayName}</span>
                                            <span className="text-xs text-muted-foreground truncate max-w-[150px]">{tutor.email}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{getStatusBadge(tutor.verificationStatus)}</TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                                        {tutor.specializations?.slice(0, 2).map((s) => (
                                            <Badge key={s} variant="secondary" className="text-[10px] px-1.5 py-0 bg-slate-100 dark:bg-slate-800">
                                                {s}
                                            </Badge>
                                        ))}
                                        {tutor.specializations?.length > 2 && (
                                            <span className="text-[10px] text-muted-foreground text-center flex items-center">+{tutor.specializations.length - 2}</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                    {tutor.hourlyRate} {tutor.currency}
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                    {tutor.createdAt ? format(new Date(tutor.createdAt), "MMM d, yyyy") : "N/A"}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-[160px]">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => onView(tutor)}>
                                                <Eye className="mr-2 h-4 w-4" /> View Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onValidate(tutor)} className="text-emerald-500 focus:text-emerald-500">
                                                <CheckCircle className="mr-2 h-4 w-4" /> Validate
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => onDelete(tutor.uid)} className="text-red-500 focus:text-red-500 focus:bg-red-50/50 dark:focus:bg-red-950/20">
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
