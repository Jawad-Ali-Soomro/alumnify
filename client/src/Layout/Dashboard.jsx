import React from 'react'
import UserDashboard from './Dashboards/User.Dashboard'
import AdminDashboard from './Dashboards/Admin.Dashboard'

const Dashboard = () => {
  const role = localStorage.getItem('role')
  switch (role) {
    case 'admin':
      return <AdminDashboard />
    case 'user':
      return <UserDashboard />
  }
  return (
    <div>
      
    </div>
  )
}

export default Dashboard
