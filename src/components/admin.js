'use client'
import React, { useState } from 'react'
import AdminLayout from './Adminlayout'
import ApartmentPanel from './Apartmentpanel'
import HousePanel from './Housepanel'
import CommercialPanel from './Commercialpanel'
import LandPanel from './Landpanel'

function Admin() {
  const [activeTab, setActiveTab] = useState('apartment')

  const handleLogout = () => {
    localStorage.removeItem('valore_token')
    window.location.reload()
  }

  const panels = {
    apartment: <ApartmentPanel />,
    house: <HousePanel />,
    commercial: <CommercialPanel />,
    land: <LandPanel />,
  }

  return (
    <AdminLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={handleLogout}
    >
      {panels[activeTab]}
    </AdminLayout>
  )
}

export default Admin