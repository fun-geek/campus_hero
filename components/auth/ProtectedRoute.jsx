'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/context/AuthContext'
import LoadingSpinner from '../ui/LoadingSpinner'

export default function ProtectedRoute({
    children,
    allowedRoles = null,
    redirectTo = '/auth/login'
}) {
    const { user, profile, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (loading) return

        if (!user) {
            router.replace(redirectTo)
            return
        }

        if (!profile) {
            router.replace('/')
            return
        }

        if (allowedRoles && !allowedRoles.includes(profile.role)) {
            router.replace('/')
        }
    }, [user, profile, loading, allowedRoles, redirectTo, router])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
                <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    if (!user || !profile) return null

    if (allowedRoles && !allowedRoles.includes(profile.role)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-6">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-3xl">!</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
                    <p className="text-gray-600 mb-6">You don&apos;t have permission to access this page.</p>
                    <button
                        onClick={() => router.replace('/')}
                        className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold hover:shadow-lg transition-all"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        )
    }

    return children
}
