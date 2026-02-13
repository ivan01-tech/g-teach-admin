"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { initMatchingsListener } from "./redux/matching-thunks";
import { MatchingList } from "./components/matching-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function MatchingsPage() {
    const dispatch = useAppDispatch();
    const { matchings, loading, error } = useAppSelector((state) => state.matchings);

    useEffect(() => {
        const promise = dispatch(initMatchingsListener());
        return () => {
            promise.unwrap().then((unsubscribe: any) => {
                if (typeof unsubscribe === "function") unsubscribe();
            });
        };
    }, [dispatch]);

    if (loading && matchings.length === 0) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Matchings</h1>
            </div>

            {error && (
                <Card className="border-destructive bg-destructive/10">
                    <CardContent className="pt-6">
                        <p className="text-destructive">Erreur: {error}</p>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Liste des Matchings</CardTitle>
                </CardHeader>
                <CardContent>
                    <MatchingList matchings={matchings} />
                </CardContent>
            </Card>
        </div>
    );
}
