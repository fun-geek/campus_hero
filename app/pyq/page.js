'use client'

import { useState } from 'react'
import { FileText, Download, Filter, BookOpen, Search } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

const pyqData = [
    {
        id: 1,
        year: '2023',
        semester: '3rd Sem',
        subject: 'Data Structures',
        code: 'CS301',
        branch: 'Computer Science',
        size: '2.4 MB',
    },
    {
        id: 2,
        year: '2023',
        semester: '3rd Sem',
        subject: 'Discrete Mathematics',
        code: 'MA301',
        branch: 'Computer Science',
        size: '1.8 MB',
    },
    {
        id: 3,
        year: '2022',
        semester: '3rd Sem',
        subject: 'Data Structures',
        code: 'CS301',
        branch: 'Computer Science',
        size: '2.1 MB',
    },
    {
        id: 4,
        year: '2023',
        semester: '5th Sem',
        subject: 'Operating Systems',
        code: 'CS501',
        branch: 'Computer Science',
        size: '3.2 MB',
    },
    {
        id: 5,
        year: '2022',
        semester: '5th Sem',
        subject: 'Computer Networks',
        code: 'CS502',
        branch: 'Computer Science',
        size: '2.9 MB',
    },
    {
        id: 6,
        year: '2023',
        semester: '1st Sem',
        subject: 'Engineering Physics',
        code: 'PH101',
        branch: 'Common',
        size: '4.1 MB',
    },
    {
        id: 7,
        year: '2023',
        semester: '1st Sem',
        subject: 'Problem Solving',
        code: 'CS101',
        branch: 'Common',
        size: '1.5 MB',
        url: '/pdfs/btech-2-sem.pdf',
    },
]

export default function PYQPage() {
    const [selectedSem, setSelectedSem] = useState('All')
    const [searchQuery, setSearchQuery] = useState('')

    const semesters = ['All', '1st Sem', '2nd Sem', '3rd Sem', '4th Sem', '5th Sem', '6th Sem', '7th Sem', '8th Sem']

    const filteredData = pyqData.filter(paper => {
        const matchesSem = selectedSem === 'All' || paper.semester === selectedSem
        const matchesSearch = paper.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              paper.code.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesSem && matchesSearch
    })

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
            <div className="px-6 pt-8 pb-6">
                <div className="max-w-md mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <FileText className="w-8 h-8 text-violet-600" />
                            PYQ Papers
                        </h1>
                        <p className="text-gray-600">Access previous year question papers to boost your exam prep.</p>
                    </div>

                    {/* Filters & Search */}
                    <Card className="mb-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search subject or code..." 
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                    <Filter className="w-4 h-4" /> Filter by Semester
                                </h3>
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {semesters.map(sem => (
                                        <button
                                            key={sem}
                                            onClick={() => setSelectedSem(sem)}
                                            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                                                selectedSem === sem 
                                                ? 'bg-violet-600 text-white shadow-md' 
                                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                            }`}
                                        >
                                            {sem}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Results list */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-2 px-1">
                            <h2 className="text-lg font-bold text-gray-800">Available Papers</h2>
                            <span className="text-sm font-medium text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full">
                                {filteredData.length} files
                            </span>
                        </div>

                        {filteredData.length > 0 ? (
                            filteredData.map(paper => (
                                <Card hover key={paper.id} className="group">
                                    <div className="flex items-start justify-between">
                                        <div className="flex gap-3">
                                            <div className="mt-1 p-2 bg-violet-100 rounded-lg text-violet-600">
                                                <BookOpen className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800 leading-tight mb-1">{paper.subject}</h3>
                                                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mb-2">
                                                    <span className="font-medium text-violet-600">{paper.code}</span>
                                                    <span>•</span>
                                                    <span>{paper.semester}</span>
                                                    <span>•</span>
                                                    <span>Year: {paper.year}</span>
                                                </div>
                                                <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] uppercase font-bold rounded">
                                                    {paper.branch}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end justify-between h-full">
                                            <span className="text-xs text-gray-400 font-medium mb-3">{paper.size}</span>
                                            <a 
                                                href={paper.url || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors group-hover:text-violet-500"
                                            >
                                                <Download className="w-5 h-5" />
                                            </a>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-10 px-4">
                                <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                    <FileText className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-1">No papers found</h3>
                                <p className="text-gray-500 text-sm">We couldn't find any papers matching your current filters.</p>
                                <Button 
                                    variant="outline" 
                                    className="mt-4"
                                    onClick={() => {
                                        setSelectedSem('All')
                                        setSearchQuery('')
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
