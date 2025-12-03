'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabaseClient'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })

  const supabase = createSupabaseClient()

  // Fetch categories from database
  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    try {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      if (data) {
        // Fetch asset counts for each category
        const categoriesWithCounts = await Promise.all(
          data.map(async (cat) => {
            const { count } = await supabase
              .from('assets')
              .select('*', { count: 'exact', head: true })
              .eq('category_id', cat.id)
            
            return {
              id: cat.id,
              name: cat.name,
              description: cat.description || '',
              assetCount: count || 0,
              createdBy: cat.created_by || 'N/A'
            }
          })
        )
        
        setCategories(categoriesWithCounts)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch categories')
      console.error('Error fetching categories:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error: insertError } = await supabase
        .from('categories')
        .insert([
          {
            name: formData.name,
            description: formData.description,
            created_by: user.email || user.id
          }
        ])
        .select()
        .single()

      if (insertError) throw insertError

      // Refresh categories list
      await fetchCategories()
      setFormData({ name: '', description: '' })
      setShowModal(false)
    } catch (err: any) {
      setError(err.message || 'Failed to create category')
      console.error('Error creating category:', err)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      // Refresh categories list
      await fetchCategories()
    } catch (err: any) {
      setError(err.message || 'Failed to delete category')
      console.error('Error deleting category:', err)
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
                <h1 className="text-xl font-bold text-gray-900">Asset Manager</h1>
              </div>

              <div className="flex space-x-1">
                <Link href="/Admin/Dashboard" className="px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg font-medium text-sm">
                  Dashboard
                </Link>
                <Link href="/Admin/users" className="px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg font-medium text-sm">
                  Users
                </Link>
                <Link href="/Admin/categories" className="px-4 py-2 text-white bg-blue-600 rounded-lg font-medium text-sm">
                  Categories
                </Link>
                <Link href="/Admin/departments" className="px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg font-medium text-sm">
                  Departments
                </Link>
                <Link href="/Admin/assets" className="px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg font-medium text-sm">
                  Assets
                </Link>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium text-sm"
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

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Manage Categories</h2>
            <p className="text-gray-600 mt-2">View and manage asset categories</p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl"
          >
            + Add New Category
          </button>
        </div>

        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading categories...</p>
          </div>
        )}

        {/* Categories Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-500">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Category Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Asset Count</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Created By</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {category.name}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {category.description}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                        {category.assetCount} assets
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {category.createdBy}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 hover:text-red-800 font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-blue-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories yet</h3>
            <p className="text-gray-600">Create your first category to get started</p>
          </div>
        )}

      </main>

      {/* Add Category Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">

            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-5">
              <h3 className="text-xl font-bold text-white">Add New Category</h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="e.g. Office Supplies"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Brief description of this category"
                  rows={3}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:from-blue-700 hover:to-blue-600"
                >
                  Create Category
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}