"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Eye } from "lucide-react";
import { profileViewService } from "@/lib/services/profile-view-service";

interface ProfileViewStats {
  totalViews: number;
  loading: boolean;
  error?: string;
}

export function ProfileViewsStats() {
  const [stats, setStats] = useState<ProfileViewStats>({
    totalViews: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const totalViews = await profileViewService.getTotalProfileViews();
        setStats({
          totalViews,
          loading: false,
        });
      } catch (error) {
        console.error("Failed to fetch profile view stats:", error);
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to load statistics",
        }));
      }
    };

    fetchStats();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-medium">Total Profile Views</CardTitle>
          <CardDescription>All views across all tutor profiles</CardDescription>
        </div>
        <Eye className="h-5 w-5 text-blue-500" />
      </CardHeader>
      <CardContent>
        {stats.loading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : stats.error ? (
          <p className="text-sm text-red-500">{stats.error}</p>
        ) : (
          <div className="text-3xl font-bold text-foreground">{stats.totalViews}</div>
        )}
      </CardContent>
    </Card>
  );
}
