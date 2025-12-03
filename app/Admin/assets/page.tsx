// app/Admin/assets/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Asset {
  id: string
  name: string
  description: string
  category_id: string | null
  department_id: string | null
  created_at: string
}

interface Category {
  id: string
  name: string
}

interface Department {
  id: string
  name: string
}

interface FormData {
  name: string
  description: string
  category_id: string
  department_id: string
}

export default function AdminAssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    category_id: '',
    department_id: ''
  })

  useEffect(() => {
    fetchAllData()
  }, [])

  async function fetchAllData() {
    try {
      setLoading(true)
      setError('')
      const [assetsRes, categoriesRes, departmentsRes] = await Promise.all([
        fetch('/api/admin/assets'),
        fetch('/api/admin/categories'),
        fetch('/api/admin/departments')
      ])

      if (!assetsRes.ok || !categoriesRes.ok || !departmentsRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const assetsData = await assetsRes.json()
      const categoriesData = await categoriesRes.json()
      const departmentsData = await departmentsRes.json()

      setAssets(Array.isArray(assetsData) ? assetsData : [])
      setCategories(Array.isArray(categoriesData) ? categoriesData : [])
      setDepartments(Array.isArray(departmentsData) ? departmentsData : [])
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setCreating(true)

    try {
      const res = await fetch('/api/admin/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          category_id: formData.category_id || null,
          department_id: formData.department_id || null
        })
      })
      const body = await res.json()
      if (!res.ok || body?.error) throw new Error(body?.error || 'Create failed')
      await fetchAllData()
      setFormData({ name: '', description: '', category_id: '', department_id: '' })
      setShowModal(false)
      alert('Asset created successfully!')
    } catch (err: any) {
      setError(err?.message || 'Failed to create asset')
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this asset?')) return

    try {
      const res = await fetch('/api/admin/assets', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      const body = await res.json()
      if (!res.ok || body?.error) throw new Error(body?.error || 'Delete failed')
      await fetchAllData()
      alert('Asset deleted successfully!')
    } catch (err: any) {
      setError(err?.message || 'Failed to delete asset')
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
                <Link href="/Admin/dashboard" className="px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg font-medium text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Dashboard
                </Link>
                <Link href="/Admin/users" className="px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg font-medium text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Users
                </Link>
                <Link href="/Admin/categories" className="px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg font-medium text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Categories
                </Link>
                <Link href="/Admin/departments" className="px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg font-medium text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Departments
                </Link>
                <Link href="/Admin/assets" className="px-4 py-2 text-white bg-blue-600 rounded-lg font-medium text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
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
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <p className="text-sm text-red-700" style={{ fontFamily: 'Poppins, sans-serif' }}>{error}</p>
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Manage Assets</h2>
            <p className="text-gray-600 mt-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Create and manage assets ({assets.length} {assets.length === 1 ? 'asset' : 'assets'})
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => fetchAllData()} disabled={loading} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Refresh
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              + Add New Asset
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>Loading assets...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {assets.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>No assets found</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  + Create First Asset
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-600 to-blue-500">
                    <tr>
                      <th className="px-6 py-3 text-left text-white font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>Name</th>
                      <th className="px-6 py-3 text-left text-white font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>Description</th>
                      <th className="px-6 py-3 text-left text-white font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>Category</th>
                      <th className="px-6 py-3 text-left text-white font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>Department</th>
                      <th className="px-6 py-3 text-left text-white font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>Created</th>
                      <th className="px-6 py-3 text-left text-white font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {assets.map(asset => {
                      const cat = categories.find(c => c.id === asset.category_id)
                      const dept = departments.find(d => d.id === asset.department_id)
                      return (
                        <tr key={asset.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>{asset.name}</td>
                          <td className="px-6 py-4 text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>{asset.description}</td>
                          <td className="px-6 py-4 text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>{cat?.name || '—'}</td>
                          <td className="px-6 py-4 text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>{dept?.name || '—'}</td>
                          <td className="px-6 py-4 text-gray-600 text-sm">{new Date(asset.created_at).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleDelete(asset.id)}
                              className="text-red-600 hover:text-red-800 font-medium"
                              style={{ fontFamily: 'Poppins, sans-serif' }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add Asset Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-5">
              <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Add New Asset</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Asset Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  placeholder="e.g., Laptop"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  placeholder="Brief description..."
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Category
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  <option value="">Select a category (optional)</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Department
                </label>
                <select
                  value={formData.department_id}
                  onChange={(e) => setFormData({...formData, department_id: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  <option value="">Select a department (optional)</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
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
                  {creating ? 'Creating...' : 'Create Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
