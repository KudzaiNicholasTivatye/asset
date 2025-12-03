// app/admin/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalAssets: 0,
    totalUsers: 0,
    totalDepartments: 0,
    totalCategories: 0
  })

  const [recentAssets, setRecentAssets] = useState([
    { id: 1, name: 'Dell Laptop', category: 'Computers', department: 'IT', cost: 1200, date: '2024-11-15', createdBy: 'admin@example.com' },
    { id: 2, name: 'Office Chair', category: 'Furniture', department: 'HR', cost: 350, date: '2024-11-10', createdBy: 'user@example.com' },
  ])

  // Simulate fetching stats
  useEffect(() => {
    setStats({
      totalAssets: 45,
      totalUsers: 12,
      totalDepartments: 5,
      totalCategories: 8
    })
  }, [])

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
                <Link href="/Admin/Dashboard" className="px-4 py-2 text-white bg-blue-600 rounded-lg font-medium text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Admin Dashboard</h2>
          <p className="text-gray-600 mt-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Overview of your asset management system</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Assets */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>Total Assets</p>
                <p className="text-4xl font-bold text-gray-900 mt-2" style={{ fontFamily: 'Poppins, sans-serif' }}>{stats.totalAssets}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <Link href="/Admin/assets" className="text-blue-600 text-sm font-medium mt-4 inline-block hover:underline" style={{ fontFamily: 'Poppins, sans-serif' }}>
              View all →
            </Link>
          </div>

          {/* Total Users */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-green-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>Total Users</p>
                <p className="text-4xl font-bold text-gray-900 mt-2" style={{ fontFamily: 'Poppins, sans-serif' }}>{stats.totalUsers}</p>
              </div>
              <div className="bg-green-100 rounded-full p-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <Link href="/Admin/users" className="text-green-600 text-sm font-medium mt-4 inline-block hover:underline" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Manage →
            </Link>
          </div>

          {/* Total Departments */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-purple-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>Departments</p>
                <p className="text-4xl font-bold text-gray-900 mt-2" style={{ fontFamily: 'Poppins, sans-serif' }}>{stats.totalDepartments}</p>
              </div>
              <div className="bg-purple-100 rounded-full p-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <Link href="/Admin/departments" className="text-purple-600 text-sm font-medium mt-4 inline-block hover:underline" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Manage →
            </Link>
          </div>

          {/* Total Categories */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-orange-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>Categories</p>
                <p className="text-4xl font-bold text-gray-900 mt-2" style={{ fontFamily: 'Poppins, sans-serif' }}>{stats.totalCategories}</p>
              </div>
              <div className="bg-orange-100 rounded-full p-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
            <Link href="/Admin/categories" className="text-orange-600 text-sm font-medium mt-4 inline-block hover:underline" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Manage →
            </Link>
          </div>
        </div>

        {/* Recent Assets Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-500">
            <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Recent Assets</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-50 border-b border-blue-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>Asset Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>Category</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>Department</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>Cost</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>Created By</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {asset.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {asset.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {asset.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      ${asset.cost.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {new Date(asset.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {asset.createdBy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}