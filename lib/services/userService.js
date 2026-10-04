import {
    doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs, serverTimestamp
} from 'firebase/firestore'
import { db } from '../firebase'

export async function createUserProfile(uid, userData) {
    try {
        const profileData = {
            email: userData.email, displayName: userData.displayName, role: userData.role,
            createdAt: serverTimestamp(), profileComplete: true,
        }
        if (userData.role === 'student' && userData.studentData) profileData.studentData = userData.studentData
        if (userData.role === 'senior' && userData.seniorData) profileData.seniorData = userData.seniorData
        if (userData.role === 'faculty' && userData.facultyData) profileData.facultyData = userData.facultyData
        if ((userData.role === 'senior' || userData.role === 'faculty') && userData.mentorData) profileData.mentorData = userData.mentorData
        await setDoc(doc(db, 'users', uid), profileData)
        return { success: true, data: profileData }
    } catch (error) {
        console.error('Error creating user profile:', error)
        return { success: false, error: error.message }
    }
}
export async function getUserProfile(uid) {
    try {
        const snap = await getDoc(doc(db, 'users', uid))
        return snap.exists() ? { success: true, data: { id: snap.id, ...snap.data() } } : { success: false, error: 'User profile not found' }
    } catch (error) { return { success: false, error: error.message } }
}
export async function updateUserProfile(uid, updates) {
    try {
        const safeUpdates = { ...updates }; delete safeUpdates.role
        await updateDoc(doc(db, 'users', uid), { ...safeUpdates, updatedAt: serverTimestamp() })
        return { success: true }
    } catch (error) { return { success: false, error: error.message } }
}
export async function getUsersByRole(role) {
    try {
        const snapshot = await getDocs(query(collection(db, 'users'), where('role', '==', role)))
        return { success: true, data: snapshot.docs.map((item) => ({ id: item.id, ...item.data() })) }
    } catch (error) { return { success: false, error: error.message } }
}
export async function getMentors({ publishedOnly = false } = {}) {
    try {
        const [seniorSnapshot, facultySnapshot] = await Promise.all([
            getDocs(query(collection(db, 'users'), where('role', '==', 'senior'))),
            getDocs(query(collection(db, 'users'), where('role', '==', 'faculty')))
        ])
        const data = [...seniorSnapshot.docs, ...facultySnapshot.docs]
            .map((item) => ({ id: item.id, ...item.data() }))
            .filter((mentor) => !publishedOnly || (mentor.mentorData?.verified === true && mentor.mentorData?.isPublished === true))
        return { success: true, data }
    } catch (error) { return { success: false, error: error.message } }
}
export async function updateMentorProfile(uid, mentorData) {
    try {
        await updateDoc(doc(db, 'users', uid), {
            mentorData: { ...mentorData, verified: mentorData.verified === true, isPublished: mentorData.isPublished === true },
            updatedAt: serverTimestamp()
        })
        return { success: true }
    } catch (error) { return { success: false, error: error.message } }
}
