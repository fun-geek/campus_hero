'use client'

import { useState, useEffect } from 'react'
import { Shield, Users, GraduationCap, Award, UsersIcon as FacultyIcon, TrendingUp, Mail, Plus, Pencil, Trash2, X } from 'lucide-react'
import { useAuth } from '@/lib/context/AuthContext'
import Card from '@/components/ui/Card'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { getUsersByRole } from '@/lib/services/userService'
import { createClub, updateClub, deleteClub, getClubs } from '@/lib/services/clubService'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

function AdminDashboardContent() {
    const { profile } = useAuth()
    const [stats, setStats] = useState({
        students: 0,
        seniors: 0,
        faculty: 0,
        admins: 0,
        total: 0,
    })
    const [loading, setLoading] = useState(true)
    const [clubs, setClubs] = useState([])
    const [clubLoading, setClubLoading] = useState(true)
    const [clubError, setClubError] = useState('')
    const [editingClub, setEditingClub] = useState(null)
    const [showClubForm, setShowClubForm] = useState(false)
    const [clubForm, setClubForm] = useState({
        name: '', tagline: '', description: '', category: 'Technical',
        logo: '🏛️', memberCount: 0, website: '', joinProcess: '', contact: ''
    })

    useEffect(() => {
        loadStats()
        loadClubs()
    }, [])

    const loadClubs = async () => {
        setClubLoading(true)
        const result = await getClubs()
        if (result.success) setClubs(result.data)
        else setClubError(result.error || 'Unable to load clubs.')
        setClubLoading(false)
    }

    const resetClubForm = () => {
        setClubForm({
            name: '', tagline: '', description: '', category: 'Technical',
            logo: '🏛️', memberCount: 0, website: '', joinProcess: '', contact: ''
        })
        setEditingClub(null)
        setShowClubForm(false)
    }

    const handleClubSubmit = async (event) => {
        event.preventDefault()
        setClubError('')
        const payload = {
            ...clubForm,
            memberCount: Number(clubForm.memberCount) || 0,
        }
        const result = editingClub
            ? await updateClub(editingClub.id, payload)
            : await createClub(payload)
        if (!result.success) {
            setClubError(result.error || 'Unable to save club.')
            return
        }
        resetClubForm()
        await loadClubs()
    }

    const handleEditClub = (club) => {
        setEditingClub(club)
        setClubForm({
            name: club.name || '',
            tagline: club.tagline || '',
            description: club.description || '',
            category: club.category || 'Technical',
            logo: club.logo || '🏛️',
            memberCount: club.memberCount || 0,
            website: club.website || '',
            joinProcess: club.joinProcess || '',
            contact: club.contact || '',
        })
        setShowClubForm(true)
    }

    const handleDeleteClub = async (club) => {
        if (!window.confirm(`Delete "${club.name}"? This cannot be undone.`)) return
        setClubError('')
        const result = await deleteClub(club.id)
        if (!result.success) {
            setClubError(result.error || 'Unable to delete club.')
            return
        }
        await loadClubs()
    }

    const loadStats = async () => {
        const [studentsRes, seniorsRes, facultyRes, adminsRes] = await Promise.all([
            getUsersByRole('student'),
            getUsersByRole('senior'),
            getUsersByRole('faculty'),
            getUsersByRole('admin'),
        ])

        const studentsCount = studentsRes.success ? studentsRes.data.length : 0
        const seniorsCount = seniorsRes.success ? seniorsRes.data.length : 0
        const facultyCount = facultyRes.success ? facultyRes.data.length : 0
        const adminsCount = adminsRes.success ? adminsRes.data.length : 0

        setStats({
            students: studentsCount,
            seniors: seniorsCount,
            faculty: facultyCount,
            admins: adminsCount,
            total: studentsCount + seniorsCount + facultyCount + adminsCount,
        })
        setLoading(false)
    }

    const statCards = [
        {
            label: 'Total Users',
            value: stats.total,
            icon: Users,
            gradient: 'from-blue-500 to-cyan-500',
        },
        {
            label: 'Students',
            value: stats.students,
            icon: GraduationCap,
            gradient: 'from-purple-500 to-pink-500',
        },
        {
            label: 'Seniors/Alumni',
            value: stats.seniors,
            icon: Award,
            gradient: 'from-orange-500 to-red-500',
        },
        {
            label: 'Faculty',
            value: stats.faculty,
            icon: FacultyIcon,
            gradient: 'from-green-500 to-emerald-500',
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 pb-8">
            {/* Header */}
            <div className="px-6 pt-12 pb-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                            <Shield className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
                            <p className="text-gray-600">Welcome back, {profile?.displayName}!</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="px-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    {loading ? (
                        <div className="text-center py-12">
                            <LoadingSpinner size="lg" />
                            <p className="mt-4 text-gray-600">Loading statistics...</p>
                        </div>
                    ) : (
                        <>
                            {/* Stats Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                {statCards.map((stat, index) => (
                                    <Card key={index} hover>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-md`}>
                                                <stat.icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                                                <p className="text-xs text-gray-600">{stat.label}</p>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            {/* Club Management */}
                            <Card>
                                <div className="flex items-center justify-between gap-3 mb-4">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">Club Management</h2>
                                        <p className="text-xs text-gray-500">Create and maintain the clubs shown to students.</p>
                                    </div>
                                    <Button size="sm" onClick={() => {
                                        setEditingClub(null)
                                        setClubForm({
                                            name: '', tagline: '', description: '', category: 'Technical',
                                            logo: '🏛️', memberCount: 0, website: '', joinProcess: '', contact: ''
                                        })
                                        setShowClubForm(true)
                                    }}>
                                        <Plus className="w-4 h-4" /> Add Club
                                    </Button>
                                </div>

                                {clubError && (
                                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                                        {clubError}
                                    </div>
                                )}

                                {showClubForm && (
                                    <form onSubmit={handleClubSubmit} className="mb-5 space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold">{editingClub ? 'Edit Club' : 'Add Club'}</h3>
                                            <button type="button" onClick={resetClubForm} aria-label="Close">
                                                <X className="w-5 h-5 text-gray-500" />
                                            </button>
                                        </div>
                                        <Input label="Club Name" value={clubForm.name} onChange={(e) => setClubForm({...clubForm, name: e.target.value})} required />
                                        <Input label="Tagline" value={clubForm.tagline} onChange={(e) => setClubForm({...clubForm, tagline: e.target.value})} />
                                        <textarea
                                            value={clubForm.description}
                                            onChange={(e) => setClubForm({...clubForm, description: e.target.value})}
                                            placeholder="Description"
                                            required
                                            className="w-full rounded-xl border border-gray-200 p-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            rows={3}
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <Input label="Category" value={clubForm.category} onChange={(e) => setClubForm({...clubForm, category: e.target.value})} required />
                                            <Input label="Logo / Emoji" value={clubForm.logo} onChange={(e) => setClubForm({...clubForm, logo: e.target.value})} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Input label="Members" type="number" min="0" value={clubForm.memberCount} onChange={(e) => setClubForm({...clubForm, memberCount: e.target.value})} />
                                            <Input label="Contact Email" type="email" value={clubForm.contact} onChange={(e) => setClubForm({...clubForm, contact: e.target.value})} />
                                        </div>
                                        <Input label="Website" type="url" value={clubForm.website} onChange={(e) => setClubForm({...clubForm, website: e.target.value})} />
                                        <textarea
                                            value={clubForm.joinProcess}
                                            onChange={(e) => setClubForm({...clubForm, joinProcess: e.target.value})}
                                            placeholder="How can students join?"
                                            className="w-full rounded-xl border border-gray-200 p-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            rows={2}
                                        />
                                        <div className="flex gap-2">
                                            <Button type="submit" size="sm">{editingClub ? 'Save Changes' : 'Create Club'}</Button>
                                            <Button type="button" variant="secondary" size="sm" onClick={resetClubForm}>Cancel</Button>
                                        </div>
                                    </form>
                                )}

                                {clubLoading ? (
                                    <p className="text-sm text-gray-500">Loading clubs...</p>
                                ) : clubs.length === 0 ? (
                                    <p className="text-sm text-gray-500">No Firestore clubs yet. Add your first club above.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {clubs.map((club) => (
                                            <div key={club.id} className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 p-3">
                                                <div className="min-w-0">
                                                    <p className="font-medium text-gray-800 truncate">{club.logo} {club.name}</p>
                                                    <p className="text-xs text-gray-500">{club.category} · {club.memberCount || 0} members</p>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button type="button" onClick={() => handleEditClub(club)} className="p-2 rounded-lg hover:bg-gray-100" aria-label="Edit club">
                                                        <Pencil className="w-4 h-4 text-gray-500" />
                                                    </button>
                                                    <button type="button" onClick={() => handleDeleteClub(club)} className="p-2 rounded-lg hover:bg-red-50" aria-label="Delete club">
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Card>

                            {/* Quick Actions */}
                            <Card>
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
                                <div className="space-y-2">
                                    <button className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all text-left">
                                        <Users className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="font-medium">Manage Users</p>
                                            <p className="text-xs text-gray-500">View and edit user accounts</p>
                                        </div>
                                    </button>
                                    <button className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all text-left">
                                        <TrendingUp className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="font-medium">View Analytics</p>
                                            <p className="text-xs text-gray-500">See detailed usage statistics</p>
                                        </div>
                                    </button>
                                    <button className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all text-left">
                                        <Mail className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="font-medium">Send Announcements</p>
                                            <p className="text-xs text-gray-500">Broadcast messages to users</p>
                                        </div>
                                    </button>
                                </div>
                            </Card>

                            {/* Recent Activity */}
                            <Card>
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
                                <p className="text-sm text-gray-600">No recent activity to display.</p>
                            </Card>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function AdminDashboard() {
    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboardContent />
        </ProtectedRoute>
    )
}
