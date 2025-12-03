// app/User/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function UserDashboard() {
  const [stats, setStats] = useState({
    myAssets: 0,
    totalValue: 0,
    recentAssets: 0
  })

  const [recentAssets, setRecentAssets] = useState([
    { id: 1, name: 'MacBook Pro', category: 'Computers', cost: 2500, date: '2024-11-20' },
    { id: 2, name: 'Office Desk', category: 'Furniture', cost: 450, date: '2024-11-18' },
    { id: 3, name: 'Wireless Mouse', category: 'Electronics', cost: 50, date: '2024-11-15' },
  ])

  // Simulate fetching user stats
  useEffect(() => {
    const totalValue = recentAssets.reduce((sum, asset) => sum + asset.cost, 0)
    setStats({
      myAssets: recentAssets.length,
      totalValue: totalValue,
      recentAssets: recentAssets.filter(a => {
        const assetDate = new Date(a.date)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return assetDate >= weekAgo
      }).length
    })
  }, [recentAssets])

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
                <Link href="/User/dashboard" className="px-4 py-2 text-white bg-blue-600 rounded-lg font-medium text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Dashboard
                </Link>
                <Link href="/User/assets" className="px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg font-medium text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  My Assets
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Welcome Back! 👋</h2>
          <p className="text-gray-600 mt-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Here's an overview of your assets</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* My Assets */}
          <Link href="/User/assets" className="block">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-blue-500 hover:shadow-xl transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>My Assets</p>
                  <p className="text-4xl font-bold text-gray-900 mt-2" style={{ fontFamily: 'Poppins, sans-serif' }}>{stats.myAssets}</p>
                </div>
                <div className="bg-blue-100 rounded-full p-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <p className="text-blue-600 text-sm font-medium mt-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Total items you own
              </p>
            </div>
          </Link>

          {/* Total Value */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-green-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>Total Value</p>
                <p className="text-4xl font-bold text-gray-900 mt-2" style={{ fontFamily: 'Poppins, sans-serif' }}>${stats.totalValue.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 rounded-full p-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-green-600 text-sm font-medium mt-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Combined asset value
            </p>
          </div>

          {/* Recent Additions */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-purple-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>Recent</p>
                <p className="text-4xl font-bold text-gray-900 mt-2" style={{ fontFamily: 'Poppins, sans-serif' }}>{stats.recentAssets}</p>
              </div>
              <div className="bg-purple-100 rounded-full p-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-purple-600 text-sm font-medium mt-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Added this week
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Ready to add more assets?</h3>
              <p className="text-blue-100" style={{ fontFamily: 'Poppins, sans-serif' }}>Track and manage your company resources efficiently</p>
            </div>
            <Link 
              href="/User/assets"
              className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Go to My Assets →
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
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>Cost</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>Date Added</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {asset.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {asset.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      ${asset.cost.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {new Date(asset.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center">
            <Link 
              href="/User/assets"
              className="text-blue-600 font-semibold hover:text-blue-800 text-sm"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              View all assets →
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}