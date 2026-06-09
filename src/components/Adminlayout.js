'use client'
import React, { useState } from 'react'
import '../styles/admin.css'

const tabs = [
  { key: 'apartment', geo: 'ბინები', eng: 'Apartments', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="10" width="18" height="11" rx="1"/><path d="M9 21V10"/><path d="M15 21V10"/>
      <path d="M3 10l9-7 9 7"/>
    </svg>
  )},
  { key: 'house', geo: 'სახლები', eng: 'Houses', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  )},
  { key: 'commercial', geo: 'კომერციული', eng: 'Commercial', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="7" width="20" height="14" rx="1"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      <line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
    </svg>
  )},
  { key: 'land', geo: 'მიწა', eng: 'Land', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 20h18"/><path d="M5 20V10l7-7 7 7v10"/>
      <path d="M9 20v-5h6v5"/>
    </svg>
  )},
]

function AdminLayout({ activeTab, onTabChange, onLogout, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleTabChange = (key) => {
    onTabChange(key)
    setSidebarOpen(false)
  }

  return (
    <div className="al-wrapper">

      {/* HEADER */}
      <header className="al-header">
        <div className="al-header-left">
          <button className="al-hamburger" onClick={() => setSidebarOpen(true)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <span className="al-logo">VALORE</span>
          <span className="al-logo-sub">Admin</span>
        </div>

        <nav className="al-nav">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`al-tab ${activeTab === tab.key ? 'al-tab--active' : ''}`}
              onClick={() => onTabChange(tab.key)}
            >
              <span className="al-tab-geo">{tab.geo}</span>
              <span className="al-tab-eng">{tab.eng}</span>
            </button>
          ))}
        </nav>

        <button className="al-logout" onClick={onLogout}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span className="al-logout-text">გასვლა</span>
        </button>
      </header>

      {/* MOBILE SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <div className="al-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* MOBILE SIDEBAR */}
      <div className={`al-sidebar ${sidebarOpen ? 'al-sidebar--open' : ''}`}>
        <div className="al-sidebar-header">
          <div className="al-sidebar-brand">
            <span className="al-logo">VALORE</span>
            <span className="al-logo-sub">Admin</span>
          </div>
          <button className="al-sidebar-close" onClick={() => setSidebarOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <nav className="al-sidebar-nav">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`al-sidebar-item ${activeTab === tab.key ? 'al-sidebar-item--active' : ''}`}
              onClick={() => handleTabChange(tab.key)}
            >
              <span className="al-sidebar-icon">{tab.icon}</span>
              <div className="al-sidebar-labels">
                <span className="al-sidebar-geo">{tab.geo}</span>
                <span className="al-sidebar-eng">{tab.eng}</span>
              </div>
              {activeTab === tab.key && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{marginLeft:'auto',flexShrink:0}}>
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </button>
          ))}
        </nav>

        <div className="al-sidebar-footer">
          <button className="al-sidebar-logout" onClick={onLogout}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            გასვლა
          </button>
        </div>
      </div>

      <main className="al-main">
        {children}
      </main>
    </div>
  )
}

export default AdminLayout