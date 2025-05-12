import { Input } from '@/components/ui/input'
import { BACKEND_HOST } from '@/Utils/constant'
import axios from 'axios'
import { Trash } from 'lucide-react'
import { Search } from 'lucide-react'
import { Info } from 'lucide-react'
import { Check } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { RiWindowsLine } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'

const Users = () => {
    const [users, setUsers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [isSearchFocused, setIsSearchFocused] = useState(false)

    const fetchUsers = async () => {
        const api = await axios.get(`${BACKEND_HOST}/api/user/all`)
        setUsers(api.data.users)
        setFilteredUsers(api.data.users)
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
                {
                    filteredUsers.map((user) => (
                        <div key={user._id} className="flex justify-between items-center border rounded-full px-4 py-2 shadow-sm">
                            <div className="flex items-center gap-3 cursor-pointer" onClick={()  => navigate(`/user/${user._id}`)}>
                                <img src={user?.avatar} alt="avatar" className='w-12 h-12 rounded-full object-cover' />
                                <div>
                                    <span className='text-sm lowercase'>
                                        @{user?.username} 
                                    </span>
                                    {user.verified && (
                                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Verified</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                
                                <button className='w-10 h-10 bg-green-100 text-green-700 rounded-full flex justify-center items-center hover:bg-green-200'>
                                    <Check size={18} />
                                </button>
                                <button className='w-10 h-10 bg-red-100 text-red-700 rounded-full flex justify-center items-center hover:bg-red-200'>
                                    <Trash size={18} />
                                </button>
                                <button className='w-10 h-10 bg-blue-100 text-black rounded-full flex justify-center items-center hover:bg-blue-200'>
                                    <Info size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Users