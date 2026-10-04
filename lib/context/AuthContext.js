'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { onAuthChange } from '../services/authService'
import { getUserProfile } from '../services/userService'

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthChange(async (firebaseUser) => {
            setUser(firebaseUser)

            if (!firebaseUser) {
                setProfile(null)
                setLoading(false)
                return
            }

            const result = await getUserProfile(firebaseUser.uid)
            setProfile(result.success ? result.data : null)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const value = {
        user,
        profile,
        loading,
        isAuthenticated: !!user,
        isAdmin: profile?.role === 'admin',
        isStudent: profile?.role === 'student',
        isSenior: profile?.role === 'senior',
        isFaculty: profile?.role === 'faculty',
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
