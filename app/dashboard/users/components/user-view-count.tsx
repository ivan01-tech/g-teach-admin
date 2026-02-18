"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { profileViewService } from "@/lib/services/profile-view-service";

interface UserViewCountProps {
  tutorId: string;
}

export function UserViewCount({ tutorId }: UserViewCountProps) {
  const [viewCount, setViewCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchViewCount = async () => {
      try {
        const count = await profileViewService.getTutorViewCount(tutorId);
        setViewCount(count);
      } catch (error) {
        console.error("Failed to fetch view count:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchViewCount();
  }, [tutorId]);

  if (loading) {
    return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
  }

  return (
    <span className="text-sm font-medium text-foreground">
      {viewCount ?? 0}
    </span>
  );
}
