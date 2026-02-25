import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAppSelector } from '@/lib/hooks'
import { UserRole } from '@/lib/roles'

/**
 * Hook to check if user has admin role
 * Redirects to login if not authenticated or not admin
 */
export function useAdminProtection(): {
  isAdmin: boolean
  loading: boolean
} {
  const router = useRouter()
  const params = usePathname()
  const { user, userProfile, loading } = useAppSelector((state) => state.auth)

  useEffect(() => {
    // Only check after loading is complete
    if (!loading) {
      // If not authenticated, redirect to login
      if (!user) {
        router.push('/auth/login')
        return
      }

      // If not admin, redirect to their respective dashboard
      if (user.role === UserRole.Admin) {
        const currentRoute = params.split('/')[2] 
        if(currentRoute && currentRoute !== 'dashboard') {
          router.push('/dashboard/' + currentRoute)
        }else {
          router.push('/dashboard')
        }

        }else {
          router.push('/auth/not-authorised')
        }
    }
  }, [loading, user, userProfile, router])

  return {
    isAdmin: userProfile?.role === UserRole.Admin && !!user,
    loading,
  }
}

/**
 * Hook to just check admin status without redirecting
 * Useful for conditional rendering
 */
export function useIsAdmin(): boolean {
  const { userProfile, loading } = useAppSelector((state) => state.auth)
  
  if (loading) return false
  
  return userProfile?.role === UserRole.Admin
}
