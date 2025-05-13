import { Input } from '@/components/ui/input'
import { BACKEND_HOST } from '@/Utils/constant'
import axios from 'axios'
import { Trash, Search, Info, Check, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { RiWindowsLine } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const Users = () => {
    const [users, setUsers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [isSearchFocused, setIsSearchFocused] = useState(false)

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get(`${BACKEND_HOST}/api/user/all`)
            setUsers(data.users)
            setFilteredUsers(data.users)
        } catch (error) {
            toast.error('Failed to fetch users')
            console.error(error)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    useEffect(() => {
        const result = users.filter(user => 
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
        setFilteredUsers(result)
    }, [searchQuery, users])

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault()
                document.getElementById('search-input').focus()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    const toggleVerifyUser = async (userId) => {
        try {
            // Optimistically update the UI
            setUsers(prevUsers => 
                prevUsers.map(user => 
                    user._id === userId ? { ...user, isVerified: !user.isVerified } : user
                )
            )
            
            const { data } = await axios.post(`${BACKEND_HOST}/api/user/toggle/verify/${userId}`)
            toast.success(`User ${data.user.isVerified ? 'verified' : 'unverified'} successfully`)
        } catch (error) {
            // Revert on error
            setUsers(prevUsers => 
                prevUsers.map(user => 
                    user._id === userId ? { ...user, isVerified: !user.isVerified } : user
                )
            )
            toast.error('Failed to update verification status')
            console.error(error)
        }
    }

    const deleteUser = async (userId) => {
        try {
            setUsers(prevUsers => prevUsers.filter(user => user._id !== userId))
            await axios.delete(`${BACKEND_HOST}/api/user/${userId}`)
            toast.success('User deleted successfully')
        } catch (error) {
            fetchUsers() // Just refetch to ensure consistency
            toast.error('Failed to delete user')
            console.error(error)
        }
    }
        
    const navigate = useNavigate()
    return (
        <div className='md:ml-30 mt-30 md:mr-10'>
            <div className="flex justify-end items-center mb-10">
                <div className="flex items-center bg-background/10 border h-10 p-3 relative">
                    <Search size={18} />
                    <input 
                        id="search-input"
                        className={"bg-background border-none outline-none ml-2 rounded-none w-[300px] text-sm"} 
                        style={{borderRadius:0}} 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        placeholder={isSearchFocused ? '' : 'Search users...'}
                    />
                    <div className="flex items-center justify-center gap-1 absolute right-2">
                        <div className="px-2 py-1 text-[10px] border bg-gray-100 text-black">
                            <RiWindowsLine />
                        </div>
                        +
                        <div className="px-2 py-1 text-[10px] border bg-gray-100 text-black">
                            K
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                {filteredUsers.length === 0 ? ( 
                    <div className="text-center py-10">No users found</div>
                ) : (
                    filteredUsers.map((user) => (
                        <div key={user._id} className="flex justify-between items-center border rounded-full px-4 py-2 shadow-sm">
                            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/user/${user._id}`)}>
                                <img 
                                    src={user?.avatar} 
                                    alt="avatar" 
                                    className='w-12 h-12 rounded-full object-cover' 
                                    onError={(e) => {
                                        e.target.onerror = null
                                        e.target.src = 'https://via.placeholder.com/150'
                                    }}
                                />
                                <div>
                                    <span className='text-sm lowercase'>
                                        @{user?.username} 
                                    </span>
                                    {user.isVerified ? (
                                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Verified</span>
                                    ) : (
                                        <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Unverified</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => toggleVerifyUser(user._id)}
                                    className={`w-10 h-10 rounded-full flex justify-center items-center hover:bg-opacity-80 ${
                                        user.isVerified 
                                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                    }`}
                                >
                                    {user.isVerified ? <Check size={18} /> : <X size={18} />}
                                </button>
                                <button 
                                    onClick={() => deleteUser(user._id)}
                                    className='w-10 h-10 bg-red-100 text-red-700 rounded-full flex justify-center items-center hover:bg-red-200'
                                >
                                    <Trash size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Users