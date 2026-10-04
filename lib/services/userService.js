import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocs,
    serverTimestamp
} from 'firebase/firestore'
import { db } from '../firebase'

export async function createUserProfile(uid, userData) {
    try {
        const userRef = doc(db, 'users', uid)
        const profileData = {
            email: userData.email,
            displayName: userData.displayName,
            role: userData.role,
            createdAt: serverTimestamp(),
            profileComplete: true,
        }

        if (userData.role === 'student' && userData.studentData) {
            profileData.studentData = userData.studentData
        } else if (userData.role === 'senior' && userData.seniorData) {
            profileData.seniorData = userData.seniorData
        } else if (userData.role === 'faculty' && userData.facultyData) {
            profileData.facultyData = userData.facultyData
        }

        await setDoc(userRef, profileData)
        return { success: true, data: profileData }
    } catch (error) {
        console.error('Error creating user profile:', error)
        return { success: false, error: error.message }
    }
}

export async function getUserProfile(uid) {
    try {
        const userSnap = await getDoc(doc(db, 'users', uid))
        return userSnap.exists()
            ? { success: true, data: { id: userSnap.id, ...userSnap.data() } }
            : { success: false, error: 'User profile not found' }
    } catch (error) {
        console.error('Error getting user profile:', error)
        return { success: false, error: error.message }
    }
}

export async function updateUserProfile(uid, updates) {
    try {
        // Role changes are privileged operations and are enforced by Firestore rules.
        // Normal profile updates must never silently create/elevate a role.
        const safeUpdates = { ...updates }
        delete safeUpdates.role

        await updateDoc(doc(db, 'users', uid), {
            ...safeUpdates,
            updatedAt: serverTimestamp()
        })
        return { success: true }
    } catch (error) {
        console.error('Error updating user profile:', error)
        return { success: false, error: error.message }
    }
}

export async function getUsersByRole(role) {
    try {
        const snapshot = await getDocs(
            query(collection(db, 'users'), where('role', '==', role))
        )
        return {
            success: true,
            data: snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
        }
    } catch (error) {
        console.error('Error getting users by role:', error)
        return { success: false, error: error.message }
    }
}

export async function getMentors() {
    try {
        const [seniorSnapshot, facultySnapshot] = await Promise.all([
            getDocs(query(collection(db, 'users'), where('role', '==', 'senior'))),
            getDocs(query(collection(db, 'users'), where('role', '==', 'faculty')))
        ])

        return {
            success: true,
            data: [
                ...seniorSnapshot.docs.map((item) => ({ id: item.id, ...item.data() })),
                ...facultySnapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
            ]
        }
    } catch (error) {
        console.error('Error getting mentors:', error)
        return { success: false, error: error.message }
    }
}
