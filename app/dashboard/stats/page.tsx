"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { initStatsListeners } from "./redux/stats-thunks";
import { PlatformStatsView } from "./components/platform-stats-view";
import { EngagedUsersList } from "./components/engaged-users-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, BarChart3, Users } from "lucide-react";

export default function StatsPage() {
    const dispatch = useAppDispatch();
    const { engagedUsers, platformStats, loading, error } = useAppSelector((state) => state.stats);

    useEffect(() => {
        const promise = dispatch(initStatsListeners());
        return () => {
            promise.unwrap().then((unsubscribe: any) => {
                if (typeof unsubscribe === "function") unsubscribe();
            });
        };
    }, [dispatch]);

    if (loading && !platformStats && engagedUsers.length === 0) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Analytique</h1>
            </div>

            {error && (
                <Card className="border-destructive bg-destructive/10">
                    <CardContent className="pt-6">
                        <p className="text-destructive">Erreur: {error}</p>
                    </CardContent>
                </Card>
            )}

            <Tabs defaultValue="platform" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="platform" className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Statistiques Plateforme
                    </TabsTrigger>
                    <TabsTrigger value="engagement" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Engagement Utilisateurs
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="platform" className="space-y-6">
                    <PlatformStatsView stats={platformStats} />
                </TabsContent>

                <TabsContent value="engagement" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Utilisateurs Engagés</CardTitle>
                            <CardDescription>
                                Suivi de l'activité en temps réel des utilisateurs les plus actifs.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <EngagedUsersList users={engagedUsers} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
