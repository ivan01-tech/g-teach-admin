"use client";

import { useState } from "react";
import { ContactInquiry } from "@/lib/types";
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
import { MoreHorizontal, Mail, Archive, CheckCircle2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { contactInquiryService } from "@/lib/services/contact-inquiry-service";
import { ReplyDialog } from "./reply-dialog";

interface InquiryTableProps {
  inquiries: ContactInquiry[];
  onInquiryUpdate: (inquiry: ContactInquiry) => void;
}

export function InquiryTable({ inquiries, onInquiryUpdate }: InquiryTableProps) {
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-300";
      case "archived":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusChange = async (inquiry: ContactInquiry, newStatus: typeof inquiry.status) => {
    try {
      setUpdatingId(inquiry.id);
      await contactInquiryService.updateInquiryStatus(inquiry.id, newStatus);
      onInquiryUpdate({ ...inquiry, status: newStatus });
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleReply = (inquiry: ContactInquiry) => {
    setSelectedInquiry(inquiry);
    setReplyDialogOpen(true);
  };

  if (inquiries.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-center">
        <p className="text-muted-foreground">No inquiries found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.map((inquiry) => (
              <TableRow key={inquiry.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  {inquiry.firstName} {inquiry.lastName}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {inquiry.email}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {inquiry.subject}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getStatusColor(inquiry.status)}
                  >
                    {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(inquiry.createdAt), { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={updatingId === inquiry.id}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleReply(inquiry)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Mail className="h-4 w-4" />
                        Reply
                      </DropdownMenuItem>

                      {inquiry.status !== "resolved" && (
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(inquiry, "resolved")
                          }
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Mark Resolved
                        </DropdownMenuItem>
                      )}

                      {inquiry.status !== "archived" && (
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(inquiry, "archived")
                          }
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Archive className="h-4 w-4" />
                          Archive
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedInquiry && (
        <ReplyDialog
          inquiry={selectedInquiry}
          isOpen={replyDialogOpen}
          onOpenChange={setReplyDialogOpen}
          onReplySuccess={() => {
            onInquiryUpdate({
              ...selectedInquiry,
              status: "resolved",
            });
            setReplyDialogOpen(false);
          }}
        />
      )}
    </>
  );
}
