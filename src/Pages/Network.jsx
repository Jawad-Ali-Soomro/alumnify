import { BACKEND_HOST } from '@/Utils/constant'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { useNavigate } from 'react-router-dom'
import { UserPlus, UserMinus } from 'lucide-react'

const Network = () => {
    const userInfo = JSON.parse(window.localStorage.getItem("user"))
    const userId = userInfo._id 
    const [profileInfo, setInfo] = useState(null)
    const [activeTab, setActiveTab] = useState('followers') // 'followers' or 'following'
    const navigate = useNavigate()

    const fetchInfo = async () => {
        try {
            const api = await axios.get(`${BACKEND_HOST}/api/user/user/${userId}`)
            setInfo(api.data.user)
        } catch (error) {
            console.error("Error fetching user info:", error)
        }
    }

    const addFriend = async (friendId) => {
        try {
            await axios.post(`${BACKEND_HOST}/api/user/add-friend`, {
                userId: userInfo._id,
                friendId
            })
            fetchInfo() // Refresh the data
        } catch (error) {
            console.error("Error adding friend:", error)
        }
    }

    const removeFriend = async (friendId) => {
        try {
            await axios.post(`${BACKEND_HOST}/api/user/remove-friend`, {
                userId: userInfo._id,
                friendId
            })
            fetchInfo() // Refresh the data
        } catch (error) {
            console.error("Error removing friend:", error)
        }
    }

    const isFriend = (userId) => {
        return profileInfo?.friends?.some(friend => friend._id === userId)
    }

    useEffect(() => {
        fetchInfo()
    }, [])

    return (
        <div className="md:ml-30 mt-20 p-4">
            
            <div className="flex mb-6">
                <button
                    className={`py-2 px-4 font-medium uppercase ${activeTab === 'followers' ? 'bg-gray-100 text-black' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('followers')}
                >
                    Followers ({profileInfo?.followers?.length || 0})
                </button>
                <button
                    className={`py-2 px-4 font-medium uppercase ${activeTab === 'following' ? ' bg-gray-100 text-black' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('following')}
                >
                    Following ({profileInfo?.following?.length || 0})
                </button>
            </div>

            {activeTab === 'followers' && (
                <div className="space-y-4 gap-2 flex flex-col">
                    {profileInfo?.followers?.length > 0 ? (
                        profileInfo.followers.map(user => (
                            <div key={user._id} className="flex items-center justify-between p-3 border rounded-lg ">
                                <div 
                                    className="flex items-center space-x-3 cursor-pointer"
                                    onClick={() => navigate(`/user/${user._id}`)}
                                >
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage src={user.avatar} alt={user.username} />
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">@{user.username}</p>
                                    </div>
                                </div>
                                {user._id !== userInfo._id && (
                                    isFriend(user._id) ? (
                                        <button 
                                            onClick={() => removeFriend(user._id)}
                                            className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                                        >
                                            <UserMinus size={16} />
                                            <span>Remove</span>
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => addFriend(user._id)}
                                            className="flex items-center justify-center gap-2 px-5 py-5 py-1 bg-blue-500 text-white rounded-lg transition"
                                        >
                                            <UserPlus size={16} />
                                        </button>
                                    )
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">You don't have any followers yet.</p>
                    )}
                </div>
            )}

            {activeTab === 'following' && (
                <div className="flex flex-col gap-2">
                    {profileInfo?.following?.length > 0 ? (
                        profileInfo.following.map(user => (
                            <div key={user._id} className="flex items-center justify-between p-3 border rounded-lg ">
                                <div 
                                    className="flex items-center space-x-3 cursor-pointer"
                                    onClick={() => navigate(`/user/${user._id}`)}
                                >
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage src={user.avatar} alt={user.username} />
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">@{user.username}</p>
                                    </div>
                                </div>
                                {user._id !== userInfo._id && (
                                    isFriend(user._id) ? (
                                        <button 
                                            onClick={() => removeFriend(user._id)}
                                            className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                                        >
                                            <UserMinus size={16} />
                                            <span>Remove</span>
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => removeFriend(user._id)}
                                            className="flex items-center justify-center gap-2 px-5 py-5 py-1 bg-red-500 text-white rounded-lg transition"
                                        >
                                            <UserMinus size={16} />
                                        </button>
                                    )
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">You're not following anyone yet.</p>
                    )}
                </div>
            )}
        </div>
    )
}

export default Network