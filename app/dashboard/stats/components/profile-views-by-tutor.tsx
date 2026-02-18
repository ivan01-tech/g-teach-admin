"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useAppSelector } from "@/lib/hooks";
import { profileViewService } from "@/lib/services/profile-view-service";
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

interface TutorViewStats {
  tutorId: string;
  viewCount: number;
  tutorName?: string;
  tutorPhoto?: string;
}

export function ProfileViewsByTutor() {
  const { users } = useAppSelector((state) => state.users);
  const [tutorStats, setTutorStats] = useState<TutorViewStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTutorViewStats = async () => {
      try {
        const viewsByTutor = await profileViewService.getProfileViewsByTutor();

        // Enrich with tutor data
        const enrichedStats = Object.entries(viewsByTutor)
          .map(([tutorId, viewCount]) => {
            const tutor = users.find((u) => u.uid === tutorId);
            return {
              tutorId,
              viewCount,
              tutorName: tutor?.displayName || "Unknown",
              tutorPhoto: tutor?.photoURL || undefined,
            };
          })
          .sort((a, b) => b.viewCount - a.viewCount)
          .slice(0, 10); // Top 10 tutors

        setTutorStats(enrichedStats);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch tutor view stats:", err);
        setError("Failed to load statistics");
        setLoading(false);
      }
    };

    fetchTutorViewStats();
  }, [users]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Tutor Profiles by Views</CardTitle>
        <CardDescription>Most viewed tutor profiles in the last period</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : tutorStats.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">No profile views yet</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tutor</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tutorStats.map((stat) => (
                  <TableRow key={stat.tutorId}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-slate-200 dark:border-slate-800">
                          <AvatarImage src={stat.tutorPhoto || ""} alt={stat.tutorName} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                            {stat.tutorName?.charAt(0) || "T"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground">{stat.tutorName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">{stat.viewCount}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
