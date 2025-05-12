import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { BACKEND_HOST } from '@/Utils/constant'
import { Users2, LucideNewspaper, Settings2, Check, Trash } from 'lucide-react'
import { Users } from 'lucide-react'
import {useNavigate} from 'react-router-dom'

const AdminDashboard = () => {
  const adminInfo = JSON.parse(window.localStorage.getItem("user"))
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, postRes] = await Promise.all([
          axios.get(`${BACKEND_HOST}/api/user/all`),
          axios.get(`${BACKEND_HOST}/api/post/all`)
        ])
        setUsers(userRes.data.users)
        setPosts(postRes.data.posts)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }

    fetchData()
  }, [])

  const navigate = useNavigate()

  return (
    <div className='px-4 md:px-10 py-6 mt-20 md:ml-20 mb-20'>
      <h1 className='text-2xl md:text-4xl font-semibold mb-2'>Howdy, {adminInfo.username}!</h1>
      <h2 className='text-base md:text-xl text-gray-600'>We hope you're doing well. What would you like to do today?</h2>

      {/* Cards */}
      <div className='mt-8 grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Total Users */}
        <div className="relative rounded-xl backdrop-blur-md bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-6 h-[250px] flex flex-col justify-between shadow-lg">
          <div className="absolute top-4  left-4 bg-white text-black p-6 rounded-full rounded-full">
            <Users className='icon' />
          </div>
          <div className="text-right">
            <h1 className='text-5xl font-bold'>0{users?.length}</h1>
            <p className='text-xl'>Total Users</p>
          </div>
        </div>

        {/* Total Posts */}
        <div className="relative rounded-xl backdrop-blur-md bg-gradient-to-br from-green-500 to-teal-500 text-white p-6 h-[250px] flex flex-col justify-between shadow-lg">
          <div className="absolute top-4  left-4 bg-white text-black p-6 rounded-full rounded-full">
            <LucideNewspaper className='icon' />
          </div>
          <div className="text-right">
            <h1 className='text-5xl font-bold'>0{posts?.length}</h1>
            <p className='text-xl'>Total Posts</p>
          </div>
        </div>

        {/* Manage Button */}
        <div className="relative rounded-xl backdrop-blur-md bg-gradient-to-br from-pink-500 to-red-500 text-white p-6 h-[250px] flex flex-col justify-between shadow-lg">
          <div className="absolute top-4  left-4 bg-white text-black p-6 rounded-full rounded-full">
            <Settings2 className='icon' />
          </div>
          <div className="text-right">
            <h1 className='text-2xl font-bold'>Let's Manage</h1>
            <button className='mt-4 bg-white text-black font-semibold py-3 px-10 rounded-lg hover:bg-gray-100'>Manage</button>
          </div>
        </div>
      </div>

      {/* Users Preview */}
      <div className="mt-10">
        <div className="grid gap-4">
          {
            users.slice(0,5).map((user) => (
              <div key={user._id} className="flex justify-between items-center border rounded-full px-4 py-2  shadow-sm">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/user/${user._id}`)}>
                  <img src={user?.avatar} alt="avatar" className='w-12 h-12 rounded-full object-cover' />
                  <span className='text-sm lowercase'>
                    @{user?.username} {adminInfo._id === user._id ? "(You)" : ""}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className='w-10 h-10 bg-green-100 text-green-700 rounded-full flex justify-center items-center hover:bg-green-200'>
                    <Check size={18} />
                  </button>
                  <button className='w-10 h-10 bg-red-100 text-red-700 rounded-full flex justify-center items-center hover:bg-red-200'>
                    <Trash size={18} />
                  </button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
