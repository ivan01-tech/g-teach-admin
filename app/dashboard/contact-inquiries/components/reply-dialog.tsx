"use client";

import { useState } from "react";
import { ContactInquiry } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { emailService } from "@/lib/services/email-service";
import { contactInquiryService } from "@/lib/services/contact-inquiry-service";

interface ReplyDialogProps {
  inquiry: ContactInquiry;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onReplySuccess: () => void;
}

export function ReplyDialog({
  inquiry,
  isOpen,
  onOpenChange,
  onReplySuccess,
}: ReplyDialogProps) {
  const [replyMessage, setReplyMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      setError("Reply message cannot be empty");
      return;
    }

    setSending(true);
    setError(null);
    setSuccess(false);

    try {
      // Send email reply
      await emailService.sendInquiryReply(
        inquiry.email,
        `${inquiry.firstName} ${inquiry.lastName}`,
        inquiry.subject,
        replyMessage
      );

      // Update inquiry status to resolved
      await contactInquiryService.updateInquiryStatus(inquiry.id, "resolved");

      setSuccess(true);
      setReplyMessage("");

      // Call success callback
      setTimeout(() => {
        onReplySuccess();
        onOpenChange(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to send reply:", err);
      setError(
        err instanceof Error ? err.message : "Failed to send reply. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Reply to Inquiry</DialogTitle>
          <DialogDescription>
            Send a reply to {inquiry.firstName} {inquiry.lastName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Original Inquiry */}
          <Card className="bg-muted/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Original Inquiry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm text-muted-foreground">From</Label>
                <p className="font-medium">
                  {inquiry.firstName} {inquiry.lastName} ({inquiry.email})
                </p>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Subject</Label>
                <p className="font-medium">{inquiry.subject}</p>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Message</Label>
                <p className="text-sm whitespace-pre-wrap rounded bg-white p-3 dark:bg-slate-950">
                  {inquiry.message}
                </p>
              </div>

              {inquiry.reason && (
                <div>
                  <Label className="text-sm text-muted-foreground">Reason</Label>
                  <p className="text-sm">{inquiry.reason}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reply Form */}
          <div className="space-y-3">
            <Label htmlFor="reply">Your Reply</Label>
            <Textarea
              id="reply"
              placeholder="Type your reply here... (This will be sent as HTML email)"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              rows={8}
              disabled={sending || success}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              The reply will be automatically formatted and sent to {inquiry.email}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Message */}
          {success && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Reply sent successfully! Inquiry marked as resolved.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={sending || success}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendReply}
            disabled={sending || success || !replyMessage.trim()}
          >
            {sending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Reply"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
