"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Tutor } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Calendar,
    Mail,
    BookOpen,
    Award,
    DollarSign,
    Clock,
    Globe,
    FileText,
    ExternalLink
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ProfileDetailDialogProps {
    tutor: Tutor | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ProfileDetailDialog({ tutor, isOpen, onOpenChange }: ProfileDetailDialogProps) {
    if (!tutor) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange} >
            <DialogContent className=" min-w-[70vw] max-w-250  max-h-[90vh] p-0 overflow-hidden bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                <DialogHeader className="p-6 pb-0">
                    <div className="flex items-start gap-6">
                        <Avatar className="h-20 w-20 border-2 border-slate-100 dark:border-slate-800">
                            <AvatarImage src={tutor.photoURL} />
                            <AvatarFallback className="text-2xl bg-slate-50 dark:bg-slate-900">
                                {tutor.displayName?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <DialogTitle className="text-2xl font-bold">{tutor.displayName}</DialogTitle>
                                <Badge variant={tutor.verificationStatus === "verified" ? "default" : "secondary"}>
                                    {tutor.verificationStatus}
                                </Badge>
                            </div>
                            <DialogDescription className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                                <Mail className="h-3.5 w-3.5" />
                                {tutor.email}
                            </DialogDescription>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {tutor.specializations?.map((s) => (
                                    <Badge key={s} variant="outline" className="text-primary/70 bg-primary/5 border-primary/20 capitalize">
                                        {s.replace("-", " ")}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className="flex-1 p-6 h-full max-h-[calc(90vh-140px)]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-8">
                            <section>
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-blue-500" /> Bio & Experience
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic">
                                    "{tutor.bio || "No bio provided."}"
                                </p>
                            </section>

                            <section>
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Award className="h-4 w-4 text-purple-500" /> Certifications & Documents
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {tutor.documents?.length > 0 ? (
                                        tutor.documents.map((doc, idx) => (
                                            <a
                                                key={idx}
                                                href={doc.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all group"
                                            >
                                                <div className="h-10 w-10 flex items-center justify-center rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                                                    <FileText className="h-6 w-6" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{doc.name}</p>
                                                    <p className="text-xs text-muted-foreground uppercase">{doc.type}</p>
                                                </div>
                                                <ExternalLink className="h-4 w-4 text-slate-300 group-hover:text-primary" />
                                            </a>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic col-span-2">No documents uploaded.</p>
                                    )}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-emerald-500" /> Availability
                                </h3>
                                <div className="space-y-2">
                                    {tutor.availability?.length > 0 ? (
                                        tutor.availability.map((slot, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-2 px-3 bg-slate-50 dark:bg-slate-900/50 rounded-md text-sm">
                                                <span className="font-medium capitalize">{slot.day}</span>
                                                <span className="text-muted-foreground">{slot.startTime} - {slot.endTime}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">No availability set.</p>
                                    )}
                                </div>
                            </section>
                        </div>

                        <div className="space-y-6">
                            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <DollarSign className="h-4 w-4" /> Rate
                                    </div>
                                    <span className="font-bold text-lg">{tutor.hourlyRate} {tutor.currency}/hr</span>
                                </div>
                                <Separator className="bg-slate-200 dark:bg-slate-800" />
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <BookOpen className="h-4 w-4" /> Lessons
                                        </div>
                                        <span className="font-medium">{tutor.totalLessons}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Globe className="h-4 w-4" /> Languages
                                        </div>
                                        <div className="flex gap-1">
                                            {tutor.languages?.map(lang => (
                                                <span key={lang} className="uppercase font-semibold text-[10px]">{lang}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar className="h-4 w-4" /> Country
                                        </div>
                                        <span className="font-medium">{tutor.country || "N/A"}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-slate-400 uppercase">Levels</h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {tutor.teachingLevels?.map(level => (
                                        <Badge key={level} variant="secondary" className="px-2 py-0.5 font-normal uppercase text-[10px]">
                                            {level}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/30 flex justify-end">
                    <Button onClick={() => onOpenChange(false)} variant="outline">Close Detail</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
