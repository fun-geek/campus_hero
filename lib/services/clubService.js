import { collection, getDocs, query, orderBy, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

const clubsRef = collection(db, 'clubs')

export async function getClubs() {
    try {
        const snapshot = await getDocs(query(clubsRef, orderBy('name')))
        return {
            success: true,
            data: snapshot.docs.map((item) => ({ id: item.id, ...item.data() })),
        }
    } catch (error) {
        console.error('Error loading clubs:', error)
        return { success: false, data: [], error: error.message }
    }
}

export async function createClub(club) {
    try {
        const ref = await addDoc(clubsRef, { ...club, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
        return { success: true, id: ref.id }
    } catch (error) {
        console.error('Error creating club:', error)
        return { success: false, error: error.message }
    }
}

export async function updateClub(id, updates) {
    try {
        await updateDoc(doc(db, 'clubs', id), { ...updates, updatedAt: serverTimestamp() })
        return { success: true }
    } catch (error) {
        console.error('Error updating club:', error)
        return { success: false, error: error.message }
    }
}

export async function deleteClub(id) {
    try {
        await deleteDoc(doc(db, 'clubs', id))
        return { success: true }
    } catch (error) {
        console.error('Error deleting club:', error)
        return { success: false, error: error.message }
    }
}
