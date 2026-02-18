"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GERMAN_LEVELS, EXAM_TYPES, SPECIALIZATIONS } from "@/lib/types"
import { Loader2, CheckCircle2, User, Camera, Eye, Users, Incognito } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { profileViewService } from "@/lib/services/profile-view-service"

export default function ProfilePage() {
  const { userProfile, updateUserProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [viewStats, setViewStats] = useState({
    totalViews: 0,
    uniqueViewers: 0,
    anonymousViews: 0,
    loading: true,
  })

  const [displayName, setDisplayName] = useState(userProfile?.displayName || "")
  const [bio, setBio] = useState(userProfile?.bio || "")
  const [learningLevel, setLearningLevel] = useState(userProfile?.learningLevel || "")
  const [targetExam, setTargetExam] = useState(userProfile?.targetExam || "")
  const [hourlyRate, setHourlyRate] = useState(userProfile?.hourlyRate?.toString() || "")
  const [specializations, setSpecializations] = useState<string[]>(userProfile?.specializations || [])

  const isStudent = userProfile?.role === "student"

  // Fetch view statistics for tutors
  useEffect(() => {
    if (!isStudent && userProfile?.uid) {
      const fetchViewStats = async () => {
        try {
          const [totalViews, uniqueViewers, anonymousViews] = await Promise.all([
            profileViewService.getTutorViewCount(userProfile.uid),
            profileViewService.getTutorUniqueViewers(userProfile.uid),
            profileViewService.getTutorAnonymousViews(userProfile.uid),
          ])

          setViewStats({
            totalViews,
            uniqueViewers,
            anonymousViews,
            loading: false,
          })
        } catch (error) {
          console.error("Failed to fetch view statistics:", error)
          setViewStats((prev) => ({ ...prev, loading: false }))
        }
      }

      fetchViewStats()
    }
  }, [isStudent, userProfile?.uid])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    try {
      const data: Record<string, unknown> = { displayName, bio }

      if (isStudent) {
        data.learningLevel = learningLevel
        data.targetExam = targetExam
      } else {
        data.hourlyRate = parseFloat(hourlyRate) || 0
        data.specializations = specializations
      }

      await updateUserProfile(data)
      setSuccess(true)
    } catch (error) {
      console.error("Failed to update profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleSpecialization = (value: string) => {
    setSpecializations((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        <p className="mt-1 text-muted-foreground">
          {isStudent
            ? "Update your learning profile and goals"
            : "Manage your tutor profile and preferences"}
        </p>
      </div>

      {success && (
        <Alert className="border-accent bg-accent/10">
          <CheckCircle2 className="h-4 w-4 text-accent" />
          <AlertDescription className="text-accent">Profile updated successfully!</AlertDescription>
        </Alert>
      )}

      {/* Profile Views Statistics (Tutors Only) */}
      {!isStudent && (
        <Card className="bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 border-blue-200 dark:border-blue-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Profile View Statistics
            </CardTitle>
            <CardDescription>Track how many users have viewed your profile</CardDescription>
          </CardHeader>
          <CardContent>
            {viewStats.loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-white dark:bg-slate-900 p-4 border border-blue-100 dark:border-blue-900">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Views</p>
                      <p className="text-2xl font-bold text-foreground">{viewStats.totalViews}</p>
                    </div>
                    <Eye className="h-8 w-8 text-blue-500/30" />
                  </div>
                </div>

                <div className="rounded-lg bg-white dark:bg-slate-900 p-4 border border-purple-100 dark:border-purple-900">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Unique Viewers</p>
                      <p className="text-2xl font-bold text-foreground">{viewStats.uniqueViewers}</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-500/30" />
                  </div>
                </div>

                <div className="rounded-lg bg-white dark:bg-slate-900 p-4 border border-amber-100 dark:border-amber-900">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Anonymous Views</p>
                      <p className="text-2xl font-bold text-foreground">{viewStats.anonymousViews}</p>
                    </div>
                    <Incognito className="h-8 w-8 text-amber-500/30" />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Profile Photo */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Photo</CardTitle>
          <CardDescription>This will be displayed on your public profile</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
              {userProfile?.photoURL ? (
                <img
                  src={userProfile.photoURL || "/placeholder.svg"}
                  alt="Profile"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <User className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
            <button
              type="button"
              className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform hover:scale-105"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div>
            <Button variant="outline" size="sm">
              Upload Photo
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</p>
          </div>
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Your public profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={userProfile?.email || ""} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">
                {isStudent ? "About Me" : "Bio"}
              </Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={
                  isStudent
                    ? "Tell tutors about yourself and your learning goals..."
                    : "Tell students about your teaching experience and approach..."
                }
                rows={4}
              />
            </div>

            {/* Student-specific fields */}
            {isStudent && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="learningLevel">Current German Level</Label>
                  <Select value={learningLevel} onValueChange={setLearningLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your level" />
                    </SelectTrigger>
                    <SelectContent>
                      {GERMAN_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetExam">Target Exam (Optional)</Label>
                  <Select value={targetExam} onValueChange={setTargetExam}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an exam" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXAM_TYPES.map((exam) => (
                        <SelectItem key={exam.value} value={exam.value}>
                          {exam.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Tutor-specific fields */}
            {!isStudent && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate (EUR)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    placeholder="25.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Specializations</Label>
                  <div className="flex flex-wrap gap-2">
                    {SPECIALIZATIONS.map((spec) => (
                      <button
                        key={spec.value}
                        type="button"
                        onClick={() => toggleSpecialization(spec.value)}
                        className={`rounded-full px-3 py-1 text-sm transition-colors ${
                          specializations.includes(spec.value)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {spec.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
