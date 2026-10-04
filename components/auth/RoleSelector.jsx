'use client'

import { GraduationCap, Award, Users } from 'lucide-react'
import Card from '../ui/Card'

const roles = [
    {
        id: 'student',
        title: 'Student',
        description: 'Current student exploring campus life',
        icon: GraduationCap,
        gradient: 'from-blue-500 to-cyan-500',
        features: ['Access all features', 'Join clubs', 'Connect with mentors', 'View roadmaps']
    },
    {
        id: 'senior',
        title: 'Senior/Alumni',
        description: 'Share your knowledge and experiences',
        icon: Award,
        gradient: 'from-purple-500 to-pink-500',
        features: ['Mentor students', 'Share experiences', 'Network with alumni', 'Career guidance']
    },
    {
        id: 'faculty',
        title: 'Faculty',
        description: 'Guide and teach students',
        icon: Users,
        gradient: 'from-green-500 to-emerald-500',
        features: ['Academic guidance', 'Mentor students', 'Share resources', 'Department insights']
    },
]

export default function RoleSelector({ selectedRole, onSelectRole }) {
    return (
        <div className="space-y-4">
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Choose Your Role</h3>
                <p className="text-gray-600 text-sm">Select the role that best describes you</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {roles.map((role) => (
                    <Card
                        key={role.id}
                        hover
                        className={`
                            cursor-pointer transition-all duration-300
                            ${selectedRole === role.id
                                ? 'ring-2 ring-primary-500 shadow-lg scale-[1.02]'
                                : 'hover:shadow-md'
                            }
                        `}
                        onClick={() => onSelectRole(role.id)}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center shadow-md`}>
                                <role.icon className="w-7 h-7 text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-semibold text-gray-800">{role.title}</h4>
                                    {selectedRole === role.id && (
                                        <div className="w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center">
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 1.414l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{role.description}</p>
                                <div className="flex flex-wrap gap-1">
                                    {role.features.slice(0, 2).map((feature, idx) => (
                                        <span key={idx} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <p className="text-xs text-center text-gray-500 pt-1">
                Admin access is provisioned separately for platform security.
            </p>
        </div>
    )
}
