// app/admin/departments/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabaseClient'

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [departmentName, setDepartmentName] = useState('')

  const supabase = createSupabaseClient()

  // Fetch departments from database
  useEffect(() => {
    fetchDepartments()
  }, [])

  async function fetchDepartments() {
    try {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from('departments')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      if (data) {
        // Fetch asset counts for each department
        const departmentsWithCounts = await Promise.all(
          data.map(async (dept) => {
            const { count } = await supabase
              .from('assets')
              .select('*', { count: 'exact', head: true })
              .eq('department_id', dept.id)
            
            return {
              id: dept.id,
              name: dept.name,
              employees: dept.employees || 0,
              assets: count || 0,
              createdAt: dept.created_at || new Date().toISOString()
            }
          })
        )
        
        setDepartments(departmentsWithCounts)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch departments')
      console.error('Error fetching departments:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    
    try {
      const { data, error: insertError } = await supabase
        .from('departments')
        .insert([
          {
            name: departmentName,
            employees: 0
          }
        ])
        .select()
        .single()

      if (insertError) throw insertError

      // Refresh departments list
      await fetchDepartments()
      setDepartmentName('')
      setShowModal(false)
    } catch (err: any) {
      setError(err.message || 'Failed to create department')
      console.error('Error creating department:', err)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this department?')) return

    try {
      const { error: deleteError } = await supabase
        .from('departments')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      // Refresh departments list
      await fetchDepartments()
    } catch (err: any) {
      setError(err.message || 'Failed to delete department')
      console.error('Error deleting department:', err)
    }
  }

  function handleLogout() {
    window.location.href = '/auth'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Navigation */}
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
                <Link href="/Admin/users" className="px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg font-medium text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Users
                </Link>
                <Link href="/Admin/categories" className="px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg font-medium text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Categories
                </Link>
                <Link href="/Admin/departments" className="px-4 py-2 text-white bg-blue-600 rounded-lg font-medium text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {error}
            </p>
          </div>
        )}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Manage Departments</h2>
            <p className="text-gray-600 mt-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Organize teams and their assets</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-600 transition-all"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            + Add New Department
          </button>
        </div>

        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>Loading departments...</p>
          </div>
        )}

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {departments.map((department) => (
            <div key={department.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-purple-100 rounded-full p-3">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {department.name}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(department.id)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Employees</p>
                  <p className="text-2xl font-bold text-blue-600" style={{ fontFamily: 'Poppins, sans-serif' }}>{department.employees}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Assets</p>
                  <p className="text-2xl font-bold text-green-600" style={{ fontFamily: 'Poppins, sans-serif' }}>{department.assets}</p>
                </div>
              </div>

              <div className="text-sm text-gray-500" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Created: {new Date(department.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {departments.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-blue-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              No departments yet
            </h3>
            <p className="text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Create your first department to organize teams
            </p>
          </div>
        )}
      </main>

      {/* Add Department Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-5">
              <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Add New Department</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Department Name
                </label>
                <input
                  type="text"
                  required
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  placeholder="e.g. Marketing, Sales"
                />
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
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:from-blue-700 hover:to-blue-600"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}