'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createSupabaseClient, createSupabaseAdminClient } from '@/lib/supabaseClient'

interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

interface FormData {
  name: string
  email: string
  password: string
  role: string
}

function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    role: 'user'
  })

  const supabase = createSupabaseClient()

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      setLoading(true)
      setError('')
      
      console.log('Fetching users from profiles table...')
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (profilesError) {
        console.error('Error fetching from profiles:', profilesError)
        throw new Error(`Cannot fetch users: ${profilesError.message}`)
      }

      if (profilesData && Array.isArray(profilesData)) {
        const formattedUsers: User[] = profilesData.map(user => ({
          id: user.id,
          name: user.full_name || user.name || 'N/A',
          email: user.email || 'N/A',
          role: user.role || 'user',
          createdAt: user.created_at || new Date().toISOString()
        }))
        
        setUsers(formattedUsers)
        console.log(`Successfully fetched ${formattedUsers.length} users from profiles`)
      } else {
        setUsers([])
        console.log('No users found in profiles table')
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch users from database'
      setError(errorMessage)
      console.error('Error fetching users:', err)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setCreating(true)
    
    try {
      console.log('Creating user:', formData.email)
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            role: formData.role,
          },
          emailRedirectTo: undefined,
        },
      })

      if (authError) {
        throw new Error(`Auth error: ${authError.message}`)
      }

      if (!authData.user) {
        throw new Error('User creation failed - no user data returned')
      }

      console.log('User created in auth:', authData.user.id)

      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', authData.user.id)
        .maybeSingle()

      if (!existingProfile) {
        console.log('Creating profile manually...')
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            full_name: formData.name,
            email: formData.email,
            role: formData.role
          })

        if (profileError) {
          throw new Error(`Profile creation failed: ${profileError.message}`)
        }
      } else {
        console.log('Profile exists, updating...')
        await supabase
          .from('profiles')
          .update({
            full_name: formData.name,
            email: formData.email,
            role: formData.role
          })
          .eq('id', authData.user.id)
      }
      
      await fetchUsers()
      setFormData({ name: '', email: '', password: '', role: 'user' })
      setShowModal(false)
      alert('User created successfully!')
    } catch (err: any) {
      setError(`Failed to create user: ${err.message}`)
      console.error('Error creating user:', err)
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id)
        
      if (profileError) throw profileError

      await fetchUsers()
      alert('User deleted successfully!')
    } catch (err: any) {
      setError(err.message || 'Failed to delete user')
      console.error('Error deleting user:', err)
    }
  }

  function handleLogout() {
    window.location.href = '/auth'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <nav className="bg-white shadow-md border-b-2 border-blue-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-600 rounded-lg p-2">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Asset Manager</h1>
              </div>
              <div className="flex space-x-1">
                <Link href="/Admin/Dashboard" className="px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg font-medium text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Dashboard
                </Link>
                <Link href="/Admin/users" className="px-4 py-2 text-white bg-blue-600 rounded-lg font-medium text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Users
                </Link>
                <Link href="/Admin/categories" className="px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg font-medium text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Categories
                </Link>
                <Link href="/Admin/departments" className="px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg font-medium text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Departments
                </Link>
                <Link href="/Admin/assets" className="px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg font-medium text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Assets
                </Link>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium text-sm"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {error}
                </p>
              </div>
              <button onClick={() => setError('')} className="ml-auto">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Manage Users</h2>
            <p className="text-gray-600 mt-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Create and manage user accounts ({users.length} {users.length === 1 ? 'user' : 'users'})
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => fetchUsers()}
              disabled={loading}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold shadow hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              🔄 Refresh
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-600 transition-all"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              + Add New User
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>Loading users from database...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {users.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-blue-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  No users found
                </h3>
                <p className="text-gray-600 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Get started by creating your first user
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  + Create First User
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-600 to-blue-500">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>Name</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>Email</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>Role</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>Created At</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-green-100 text-green-800'
                          }`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                            {user.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {new Date(user.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-800 font-semibold transition-colors"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-5">
              <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Add New User</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {creating ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUsersPage