'use client'
import { useState, useEffect } from 'react'
import Auth from '../components/auth'
import Admin from '../components/admin'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('valore_token')
    setIsAuthenticated(!!token)
    setLoading(false)
  }, [])

  if (loading) return null

  return (
    <main>
      {isAuthenticated ? <Admin /> : <Auth onSuccess={() => setIsAuthenticated(true)} />}
    </main>
  )
}