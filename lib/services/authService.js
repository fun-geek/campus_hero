import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    updateProfile
} from 'firebase/auth'
import { auth } from '../firebase'
import { createUserProfile, getUserProfile } from './userService'

const SELF_SIGNUP_ROLES = new Set(['student', 'senior', 'faculty'])

export async function registerUser(email, password, userData) {
    try {
        if (!SELF_SIGNUP_ROLES.has(userData?.role)) {
            return {
                success: false,
                error: 'Invalid signup role. Admin accounts must be provisioned separately.'
            }
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        if (userData.displayName) {
            await updateProfile(user, {
                displayName: userData.displayName
            })
        }

        const profileResult = await createUserProfile(user.uid, {
            email,
            displayName: userData.displayName,
            role: userData.role,
            ...userData.profileData
        })

        if (!profileResult.success) {
            await signOut(auth)
            return {
                success: false,
                error: profileResult.error || 'Unable to create your profile.'
            }
        }

        return { success: true, user }
    } catch (error) {
        console.error('Registration error:', error)
        return {
            success: false,
            error: error.code === 'auth/email-already-in-use'
                ? 'This email is already registered.'
                : error.message
        }
    }
}

export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const user = userCredential.user
        const profileResult = await getUserProfile(user.uid)

        if (!profileResult.success) {
            await signOut(auth)
            return {
                success: false,
                error: 'Your account profile could not be loaded. Please contact an administrator.'
            }
        }

        return { success: true, user, profile: profileResult.data }
    } catch (error) {
        console.error('Login error:', error)
        return {
            success: false,
            error: error.code === 'auth/invalid-credential'
                ? 'Invalid email or password.'
                : error.message
        }
    }
}

export async function logoutUser() {
    try {
        await signOut(auth)
        return { success: true }
    } catch (error) {
        console.error('Logout error:', error)
        return { success: false, error: error.message }
    }
}

export async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email)
        return { success: true }
    } catch (error) {
        console.error('Password reset error:', error)
        return {
            success: false,
            error: error.code === 'auth/user-not-found'
                ? 'No account found with this email.'
                : error.message
        }
    }
}

export function onAuthChange(callback) {
    return onAuthStateChanged(auth, callback)
}

export function getCurrentUser() {
    return auth.currentUser
}
