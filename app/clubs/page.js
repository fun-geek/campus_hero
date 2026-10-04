'use client'

import { useEffect, useState } from 'react'
import { Search, Filter } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ClubCard from '@/components/clubs/ClubCard'
import { clubs as fallbackClubs, categories as fallbackCategories } from '@/lib/data/clubs'
import { getClubs } from '@/lib/services/clubService'

export default function ClubsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [clubs, setClubs] = useState(fallbackClubs)
    const [categories, setCategories] = useState(fallbackCategories)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true
        getClubs().then((result) => {
            if (!mounted) return
            if (result.success && result.data.length > 0) {
                setClubs(result.data)
                setCategories(['All', ...new Set(result.data.map((club) => club.category).filter(Boolean))])
            }
            setLoading(false)
        })
        return () => { mounted = false }
    }, [])

    const filteredClubs = clubs.filter((club) => {
        const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            club.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === 'All' || club.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
            <div className="px-6 pt-8 pb-6">
                <div className="max-w-md mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Club Explorer</h1>
                        <p className="text-gray-600">Discover and join campus clubs</p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative mb-4">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search clubs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors"
                        />
                    </div>

                    {/* Category Filters */}
                    <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${selectedCategory === category
                                        ? 'bg-primary-600 text-white shadow-md'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Clubs Grid */}
                    <div className="space-y-4">
                        {loading ? (
                            <Card className="text-center py-12">
                                <p className="text-gray-600">Loading clubs...</p>
                            </Card>
                        ) : filteredClubs.length > 0 ? (
                            filteredClubs.map((club) => (
                                <ClubCard key={club.id} club={club} />
                            ))
                        ) : (
                            <Card className="text-center py-12">
                                <Filter className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                <p className="text-gray-600">No clubs found. Try a different search or filter.</p>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
