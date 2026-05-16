'use client'

import { Sparkles, Users, Compass, Code, Award, TrendingUp, FileText } from 'lucide-react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

const features = [
    {
        title: 'Club Explorer',
        description: 'Discover all campus clubs and join your favorites',
        icon: Users,
        href: '/clubs',
        gradient: 'from-blue-500 to-cyan-500',
    },
    {
        title: 'Mentor Connect',
        description: 'Get guidance from seniors and alumni',
        icon: Compass,
        href: '/mentors',
        gradient: 'from-purple-500 to-pink-500',
    },
    {
        title: 'Roadmaps',
        description: 'Year-wise career and skill development paths',
        icon: TrendingUp,
        href: '/roadmaps',
        gradient: 'from-orange-500 to-red-500',
    },
    {
        title: 'Coding Resources',
        description: 'Curated resources for your coding journey',
        icon: Code,
        href: '/coding',
        gradient: 'from-green-500 to-emerald-500',
    },
    {
        title: 'Profile Builder',
        description: 'LinkedIn & GitHub optimization tips',
        icon: Award,
        href: '/linkedin-github',
        gradient: 'from-indigo-500 to-blue-500',
    },
    {
        title: 'PYQ Papers',
        description: 'Access previous year question papers',
        icon: FileText,
        href: '/pyq',
        gradient: 'from-violet-500 to-fuchsia-500',
    },
]

const stats = [
    { label: 'Active Clubs', value: '10+' },
    { label: 'Mentors', value: '10+' },
    { label: 'Students', value: '100+' },
]

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
            {/* Hero Section */}
            <div className="px-6 pt-16 pb-8">
                <div className="max-w-md mx-auto text-center">
                    {/* Animated Logo */}
                    <div className="mb-6 overflow-hidden">
                        <h1 className="text-5xl font-extrabold mb-2">
                            <span className="inline-block animate-[slideDown_0.6s_ease-out]">
                                <span className="inline-block bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-clip-text text-transparent animate-[shimmer_3s_ease-in-out_infinite] bg-[length:200%_100%]">
                                    Campus
                                </span>
                            </span>
                            {' '}
                            <span className="inline-block animate-[slideDown_0.6s_ease-out_0.1s_both]">
                                <span className="inline-block bg-gradient-to-r from-secondary-600 via-accent-500 to-secondary-600 bg-clip-text text-transparent animate-[shimmer_3s_ease-in-out_0.5s_infinite] bg-[length:200%_100%]">
                                    Hero
                                </span>
                            </span>
                        </h1>
                        <div className="h-1 w-24 mx-auto bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full animate-[slideUp_0.8s_ease-out_0.3s_both]"></div>
                    </div>

                    <p className="text-gray-600 text-lg mb-8 animate-[fadeIn_0.8s_ease-out_0.4s_both] px-4">
                        Your ultimate college companion for clubs, mentors, roadmaps, and growth
                    </p>

                    {/* Stats */}
                    <div className="flex justify-around mb-8 py-6 px-4 rounded-2xl glass animate-[fadeIn_0.8s_ease-out_0.6s_both]">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-2xl font-bold text-primary-600">{stat.value}</div>
                                <div className="text-xs text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="px-6 pb-8">
                <div className="max-w-md mx-auto">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Explore Features</h2>
                    <div className="grid grid-cols-1 gap-4">
                        {features.map((feature, index) => (
                            <Link key={index} href={feature.href}>
                                <Card hover className="group cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className={`flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-md group-hover:shadow-lg transition-all`}>
                                            <feature.icon className="w-7 h-7 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800 text-lg mb-1">
                                                {feature.title}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    {/* CTA Section */}
                    <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-600 text-white text-center">
                        <h3 className="text-xl font-bold mb-2">Ready to level up?</h3>
                        <p className="text-sm mb-4 opacity-90">
                            Start exploring and connecting with your campus community
                        </p>
                        <Button variant="secondary" className="bg-white text-primary-600 hover:bg-gray-100">
                            Get Started
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
