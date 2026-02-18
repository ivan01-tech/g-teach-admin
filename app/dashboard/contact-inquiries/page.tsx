"use client";

import { useState, useEffect } from "react";
import { ContactInquiry } from "@/lib/types";
import { contactInquiryService } from "@/lib/services/contact-inquiry-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Search, Mail } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InquiryTable } from "./components/inquiry-table";

export default function ContactInquiriesPage() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "resolved" | "archived">("all");
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoading(true);
        const data = await contactInquiryService.getContactInquiries();
        setInquiries(data);
        
        const pending = await contactInquiryService.getPendingCount();
        setPendingCount(pending);
      } catch (error) {
        console.error("Failed to fetch inquiries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  useEffect(() => {
    let filtered = inquiries;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((inquiry) => inquiry.status === statusFilter);
    }

    // Search by name or email
    if (searchTerm) {
      filtered = filtered.filter(
        (inquiry) =>
          inquiry.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inquiry.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredInquiries(filtered);
  }, [inquiries, searchTerm, statusFilter]);

  const handleInquiryUpdate = (updatedInquiry: ContactInquiry) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === updatedInquiry.id ? updatedInquiry : inq))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Contact Inquiries
          </h1>
          <p className="text-muted-foreground">
            Manage and respond to customer contact inquiries.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-linear-to-br from-blue-500/10 via-transparent to-transparent border-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Total Inquiries
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-foreground">
              {inquiries.length}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-linear-to-br from-red-500/10 via-transparent to-transparent border-red-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Pending
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-foreground">
              {pendingCount}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-linear-to-br from-emerald-500/10 via-transparent to-transparent border-emerald-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Resolved
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-foreground">
              {inquiries.filter((i) => i.status === "resolved").length}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or subject..."
                className="pl-9 bg-white dark:bg-slate-950"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value: any) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Table */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Inquiries List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <InquiryTable
              inquiries={filteredInquiries}
              onInquiryUpdate={handleInquiryUpdate}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
