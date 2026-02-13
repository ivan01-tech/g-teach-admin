"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlatformStats } from "@/lib/types";
import {
    Users,
    UserCheck,
    MessageSquare,
    Percent,
    Activity,
    Zap,
    TrendingUp,
    BarChart3
} from "lucide-react";

interface PlatformStatsViewProps {
    stats: PlatformStats | null;
}

export function PlatformStatsView({ stats }: PlatformStatsViewProps) {
    const metrics = [
        {
            title: "Total Users",
            value: stats?.totalUsers || 0,
            icon: Users,
            description: "Registered users",
            color: "text-blue-500",
        },
        {
            title: "Active Users (24h)",
            value: stats?.activeUsers24h || 0,
            icon: Activity,
            description: "Active in the last 24h",
            color: "text-green-500",
        },
        {
            title: "Total Matchings",
            value: stats?.totalMatchings || 0,
            icon: Zap,
            description: "Successful connections",
            color: "text-yellow-500",
        },
        {
            title: "Total Messages",
            value: stats?.totalMessages || 0,
            icon: MessageSquare,
            description: "Messages exchanged",
            color: "text-purple-500",
        },
        {
            title: "Conversion Rate",
            value: `${((stats?.conversionRate || 0) * 100).toFixed(1)}%`,
            icon: Percent,
            description: "Student to matching ratio",
            color: "text-indigo-500",
        },
        {
            title: "Total Tutors",
            value: stats?.totalTutors || 0,
            icon: UserCheck,
            description: "Verified tutors",
            color: "text-emerald-500",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {metrics.map((metric) => (
                <Card key={metric.title}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                        <metric.icon className={`h-4 w-4 ${metric.color}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metric.value}</div>
                        <p className="text-xs text-muted-foreground">{metric.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
