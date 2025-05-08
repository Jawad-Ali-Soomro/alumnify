import React from 'react'
import UserDashboard from './Dashboards/User.Dashboard'

const Dashboard = () => {
  const role = localStorage.getItem('role')
  switch (role) {
    case 'admin':
      return <div>Admin Dashboard</div>
    case 'user':
      return <UserDashboard />
  }
  return (
    <div>
      
    </div>
  )
}

export default Dashboard
