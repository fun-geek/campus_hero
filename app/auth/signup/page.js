'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, User, Sparkles, ArrowLeft, ArrowRight, Building, Calendar, Briefcase } from 'lucide-react'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import RoleSelector from '@/components/auth/RoleSelector'
import { registerUser } from '@/lib/services/authService'

export default function SignupPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        // Student fields
        year: '',
        branch: '',
        enrollmentNo: '',
        // Senior fields
        graduationYear: '',
        currentCompany: '',
        expertise: '',
        // Faculty fields
        department: '',
        designation: '',
        specialization: '',
    })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [generalError, setGeneralError] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
        setGeneralError('')
    }

    const validateStep1 = () => {
        const newErrors = {}

        if (!formData.displayName.trim()) {
            newErrors.displayName = 'Name is required'
        }

        if (!formData.email) {
            newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid'
        }

        if (!formData.password) {
            newErrors.password = 'Password is required'
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
        }

        return newErrors
    }

    const validateStep2 = () => {
        if (!formData.role) {
            return { role: 'Please select a role' }
        }
        return {}
    }

    const validateStep3 = () => {
        const newErrors = {}

        if (formData.role === 'student') {
            if (!formData.year) newErrors.year = 'Year is required'
            if (!formData.branch) newErrors.branch = 'Branch is required'
        } else if (formData.role === 'senior') {
            if (!formData.graduationYear) newErrors.graduationYear = 'Graduation year is required'
        } else if (formData.role === 'faculty') {
            if (!formData.department) newErrors.department = 'Department is required'
            if (!formData.designation) newErrors.designation = 'Designation is required'
        }

        return newErrors
    }

    const handleNext = () => {
        let newErrors = {}

        if (step === 1) {
            newErrors = validateStep1()
        } else if (step === 2) {
            newErrors = validateStep2()
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setStep(step + 1)
    }

    const handleBack = () => {
        setStep(step - 1)
        setErrors({})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const newErrors = validateStep3()
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setLoading(true)

        // Prepare profile data based on role
        let profileData = {}
        if (formData.role === 'student') {
            profileData.studentData = {
                year: formData.year,
                branch: formData.branch,
                enrollmentNo: formData.enrollmentNo,
            }
        } else if (formData.role === 'senior') {
            profileData.seniorData = {
                graduationYear: formData.graduationYear,
                currentCompany: formData.currentCompany,
                expertise: formData.expertise,
            }
            profileData.mentorData = {
                role: 'Senior',
                year: formData.graduationYear,
                currentPosition: formData.currentCompany,
                expertise: formData.expertise.split(',').map((item) => item.trim()).filter(Boolean),
                photo: '👨‍💻',
                linkedin: '',
                bio: '',
                available: true,
                verified: false,
                isPublished: false,
            }
        } else if (formData.role === 'faculty') {
            profileData.facultyData = {
                department: formData.department,
                designation: formData.designation,
                specialization: formData.specialization,
            }
            profileData.mentorData = {
                role: 'Faculty',
                year: '',
                currentPosition: formData.designation,
                expertise: formData.specialization.split(',').map((item) => item.trim()).filter(Boolean),
                photo: '👨‍🏫',
                linkedin: '',
                bio: '',
                available: true,
                verified: false,
                isPublished: false,
            }
        }

        const result = await registerUser(
            formData.email,
            formData.password,
            {
                displayName: formData.displayName,
                role: formData.role,
                profileData,
            }
        )

        if (result.success) {
            router.push('/')
        } else {
            setGeneralError(result.error)
            setLoading(false)
        }
    }

    const getPasswordStrength = () => {
        const password = formData.password
        if (password.length === 0) return { strength: 0, label: '' }
        if (password.length < 6) return { strength: 33, label: 'Weak', color: 'bg-red-500' }
        if (password.length < 10) return { strength: 66, label: 'Medium', color: 'bg-yellow-500' }
        return { strength: 100, label: 'Strong', color: 'bg-green-500' }
    }

    const passwordStrength = getPasswordStrength()

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 shadow-glow animate-float">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold gradient-text mb-2">Join Campus Hero</h1>
                    <p className="text-gray-600">Create your account in 3 easy steps</p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center">
                            <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                                ${step >= s
                                    ? 'bg-gradient-to-br from-primary-600 to-secondary-600 text-white shadow-md'
                                    : 'bg-gray-200 text-gray-500'
                                }
                            `}>
                                {s}
                            </div>
                            {s < 3 && (
                                <div className={`w-12 h-1 ${step > s ? 'bg-primary-600' : 'bg-gray-200'}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Form Card */}
                <Card className="p-6">
                    {generalError && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-200 mb-4">
                            <p className="text-sm text-red-600">{generalError}</p>
                        </div>
                    )}

                    {/* Step 1: Basic Info */}
                    {step === 1 && (
                        <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-4">
                            <div className="text-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
                                <p className="text-sm text-gray-600">Let&apos;s get to know you</p>
                            </div>

                            <Input
                                type="text"
                                name="displayName"
                                label="Full Name"
                                placeholder="John Doe"
                                icon={User}
                                value={formData.displayName}
                                onChange={handleChange}
                                error={errors.displayName}
                                required
                            />

                            <Input
                                type="email"
                                name="email"
                                label="Email Address"
                                placeholder="you@example.com"
                                icon={Mail}
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                                required
                            />

                            <div className="relative">
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    label="Password"
                                    placeholder="Create a strong password"
                                    icon={Lock}
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={errors.password}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-[42px] text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                                {formData.password && (
                                    <div className="mt-2">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-gray-600">Password strength</span>
                                            <span className={`text-xs font-medium ${passwordStrength.strength === 100 ? 'text-green-600' :
                                                passwordStrength.strength === 66 ? 'text-yellow-600' :
                                                    'text-red-600'
                                                }`}>{passwordStrength.label}</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                                                style={{ width: `${passwordStrength.strength}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Input
                                type="password"
                                name="confirmPassword"
                                label="Confirm Password"
                                placeholder="Re-enter your password"
                                icon={Lock}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                error={errors.confirmPassword}
                                required
                            />

                            <Button type="submit" className="w-full">
                                Next <ArrowRight size={18} className="ml-2" />
                            </Button>
                        </form>
                    )}

                    {/* Step 2: Role Selection */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <RoleSelector
                                selectedRole={formData.role}
                                onSelectRole={(role) => setFormData(prev => ({ ...prev, role }))}
                            />
                            {errors.role && (
                                <p className="text-sm text-red-500 text-center">{errors.role}</p>
                            )}

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    onClick={handleBack}
                                    variant="secondary"
                                    className="flex-1"
                                >
                                    <ArrowLeft size={18} className="mr-2" /> Back
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleNext}
                                    className="flex-1"
                                >
                                    Next <ArrowRight size={18} className="ml-2" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Role-specific Info */}
                    {step === 3 && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="text-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">Additional Details</h3>
                                <p className="text-sm text-gray-600">Help us personalize your experience</p>
                            </div>

                            {formData.role === 'student' && (
                                <>
                                    <Input
                                        type="text"
                                        name="year"
                                        label="Current Year"
                                        placeholder="e.g., 2nd Year"
                                        icon={Calendar}
                                        value={formData.year}
                                        onChange={handleChange}
                                        error={errors.year}
                                        required
                                    />
                                    <Input
                                        type="text"
                                        name="branch"
                                        label="Branch/Department"
                                        placeholder="e.g., Computer Science"
                                        icon={Building}
                                        value={formData.branch}
                                        onChange={handleChange}
                                        error={errors.branch}
                                        required
                                    />
                                    <Input
                                        type="text"
                                        name="enrollmentNo"
                                        label="Enrollment Number (Optional)"
                                        placeholder="Your enrollment number"
                                        value={formData.enrollmentNo}
                                        onChange={handleChange}
                                    />
                                </>
                            )}

                            {formData.role === 'senior' && (
                                <>
                                    <Input
                                        type="text"
                                        name="graduationYear"
                                        label="Graduation Year"
                                        placeholder="e.g., 2020"
                                        icon={Calendar}
                                        value={formData.graduationYear}
                                        onChange={handleChange}
                                        error={errors.graduationYear}
                                        required
                                    />
                                    <Input
                                        type="text"
                                        name="currentCompany"
                                        label="Current Company/Organization (Optional)"
                                        placeholder="Where are you working?"
                                        icon={Briefcase}
                                        value={formData.currentCompany}
                                        onChange={handleChange}
                                    />
                                    <Input
                                        type="text"
                                        name="expertise"
                                        label="Area of Expertise (Optional)"
                                        placeholder="e.g., Web Development, Data Science"
                                        value={formData.expertise}
                                        onChange={handleChange}
                                    />
                                </>
                            )}

                            {formData.role === 'faculty' && (
                                <>
                                    <Input
                                        type="text"
                                        name="department"
                                        label="Department"
                                        placeholder="e.g., Computer Science"
                                        icon={Building}
                                        value={formData.department}
                                        onChange={handleChange}
                                        error={errors.department}
                                        required
                                    />
                                    <Input
                                        type="text"
                                        name="designation"
                                        label="Designation"
                                        placeholder="e.g., Associate Professor"
                                        value={formData.designation}
                                        onChange={handleChange}
                                        error={errors.designation}
                                        required
                                    />
                                    <Input
                                        type="text"
                                        name="specialization"
                                        label="Specialization (Optional)"
                                        placeholder="Your area of expertise"
                                        value={formData.specialization}
                                        onChange={handleChange}
                                    />
                                </>
                            )}

                            {formData.role === 'admin' && (
                                <div className="text-center py-8">
                                    <p className="text-gray-600">
                                        Admin accounts require approval. You&apos;ll receive access once verified by the system administrator.
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    onClick={handleBack}
                                    variant="secondary"
                                    className="flex-1"
                                    disabled={loading}
                                >
                                    <ArrowLeft size={18} className="mr-2" /> Back
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <LoadingSpinner size="sm" />
                                            <span>Creating...</span>
                                        </div>
                                    ) : (
                                        'Create Account'
                                    )}
                                </Button>
                            </div>
                        </form>
                    )}
                </Card>

                {/* Already have account */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/auth/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* Back to Home */}
                <div className="mt-4 text-center">
                    <Link href="/" className="text-sm text-gray-600 hover:text-gray-800">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
