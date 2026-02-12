
"use client";

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import {
    listenToProfiles,
    deleteProfileThunk,
    validateProfileThunk
} from "./profiles-thunks";
import { ProfileTable } from "./components/profile-table";
import { ProfileDetailDialog } from "./components/profile-detail-dialog";
import { ProfileValidationDialog } from "./components/profile-validation-dialog";
import { Tutor, VerificationStatus } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Users, ShieldCheck, Clock } from "lucide-react";

export default function ProfilesPage() {
    const dispatch = useAppDispatch();
    const { profiles, loading } = useAppSelector((state) => state.profiles);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isValidating, setIsValidating] = useState(false);


    const filteredProfiles = profiles.filter((tutor) =>
        tutor.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutor.specializations?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleView = (tutor: Tutor) => {
        setSelectedTutor(tutor);
        setIsDetailOpen(true);
    };

    const handleValidateInit = (tutor: Tutor) => {
        setSelectedTutor(tutor);
        setIsValidating(true);
    };

    const handleConfirmValidation = (uid: string, status: VerificationStatus, message: string) => {
        dispatch(validateProfileThunk({ uid, status, message }));
    };

    const handleDelete = (uid: string) => {
        if (confirm("Are you sure you want to delete this tutor profile? This action cannot be undone.")) {
            dispatch(deleteProfileThunk(uid));
        }
    };

    const stats = {
        total: profiles.length,
        verified: profiles.filter(p => p.verificationStatus === "verified").length,
        pending: profiles.filter(p => p.verificationStatus === "pending").length,
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Tutor Profiles</h1>
                    <p className="text-muted-foreground">
                        Review and manage tutor certifications and status.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-linear-to-br from-blue-500/10 via-transparent to-transparent border-blue-500/20">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Tutors</CardTitle>
                            <Users className="h-4 w-4 text-blue-500" />
                        </div>
                        <CardDescription className="text-2xl font-bold text-foreground">{stats.total}</CardDescription>
                    </CardHeader>
                </Card>
                <Card className="bg-linear-to-br from-emerald-500/10 via-transparent to-transparent border-emerald-500/20">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Verified</CardTitle>
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        </div>
                        <CardDescription className="text-2xl font-bold text-foreground">{stats.verified}</CardDescription>
                    </CardHeader>
                </Card>
                <Card className="bg-linear-to-br from-amber-500/10 via-transparent to-transparent border-amber-500/20">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Pending Review</CardTitle>
                            <Clock className="h-4 w-4 text-amber-500" />
                        </div>
                        <CardDescription className="text-2xl font-bold text-foreground">{stats.pending}</CardDescription>
                    </CardHeader>
                </Card>
            </div>

            <Card className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative max-w-sm flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search tutors by name, email or skill..."
                                className="pl-9 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ProfileTable
                        tutors={filteredProfiles}
                        loading={loading}
                        onView={handleView}
                        onValidate={handleValidateInit}
                        onDelete={handleDelete}
                    />
                </CardContent>
            </Card>

            <ProfileDetailDialog
                tutor={selectedTutor}
                isOpen={isDetailOpen}
                onOpenChange={setIsDetailOpen}
            />

            <ProfileValidationDialog
                tutor={selectedTutor}
                isOpen={isValidating}
                onOpenChange={setIsValidating}
                onConfirm={handleConfirmValidation}
            />
        </div>
    );
}
