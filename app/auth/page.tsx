// app/auth/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabaseClient'

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [userType, setUserType] = useState<'user' | 'admin'>('user')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()
  const supabase = createSupabaseClient()

  // Handle Sign In with Supabase
  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }

      if (authData.user) {
        // Redirect based on selected user type
        if (userType === 'admin') {
          router.push('/Admin/Dashboard')
        } else {
          router.push('/User/dashboard')
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in')
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  // Handle Sign Up with Supabase
  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            // Set role based on selected user type
            role: userType,
          },
        },
      })

      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }

      if (authData.user) {
        // Profile is automatically created by database trigger
        // Redirect based on selected user type
        if (userType === 'admin') {
          router.push('/Admin/Dashboard')
        } else {
          router.push('/User/dashboard')
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up')
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center px-4 py-12">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
      </div>

      {/* Auth Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-10 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {isSignIn ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-blue-100 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {isSignIn ? 'Sign in to manage your assets' : 'Join us to start managing assets'}
          </p>
        </div>

        {/* Toggle Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => {
              setIsSignIn(true)
              setError('')
            }}
            className={`flex-1 py-4 text-center font-semibold transition-all duration-300 ${
              isSignIn
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setIsSignIn(false)
              setError('')
            }}
            className={`flex-1 py-4 text-center font-semibold transition-all duration-300 ${
              !isSignIn
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Sign Up
          </button>
        </div>

        {/* Form Section */}
        <div className="px-8 py-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {error}
              </p>
            </div>
          )}

          <form onSubmit={isSignIn ? handleSignIn : handleSignUp} className="space-y-5">
            {/* Full Name (Sign Up Only) */}
            {!isSignIn && (
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required={!isSignIn}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  placeholder="••••••••"
                />
              </div>
              {!isSignIn && (
                <p className="mt-2 text-xs text-gray-500" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Must be at least 6 characters
                </p>
              )}
            </div>

            {/* User Type Selection */}
            <div>
              <label
                htmlFor="userType"
                className="block text-sm font-semibold text-gray-700 mb-2"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Sign in as
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <select
                  id="userType"
                  name="userType"
                  required
                  value={userType}
                  onChange={(e) => setUserType(e.target.value as 'user' | 'admin')}
                  className="block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none bg-white"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  <option value="user">System User</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Forgot Password (Sign In Only) */}
            {isSignIn && (
              <div className="flex items-center justify-end">
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Forgot password?
                </a>
              </div>
            )}

            {/* Terms (Sign Up Only) */}
            {!isSignIn && (
              <div className="flex items-start">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="terms"
                  className="ml-3 text-sm text-gray-600"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                    Terms and Conditions
                  </a>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3.5 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {loading ? 'Processing...' : (isSignIn ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {/* Demo Credentials (Sign In Only) */}
          {isSignIn && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Demo Accounts
              </p>
              <div className="bg-blue-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center text-xs" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  <span className="font-semibold text-gray-700">Admin:</span>
                  <span className="text-gray-600">admin@example.com</span>
                </div>
                <div className="flex justify-between items-center text-xs" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  <span className="font-semibold text-gray-700">User:</span>
                  <span className="text-gray-600">user@example.com</span>
                </div>
                <div className="text-center text-xs text-gray-500 mt-2 pt-2 border-t border-blue-100" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Password: password123
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


