import { Heart, ChevronDown, ChevronUp, Share2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [expandedPosts, setExpandedPosts] = useState({});
  
  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/post/all');
      setPosts(response.data.posts);
      const initialExpandedState = {};
      response.data.posts.forEach(post => {
        initialExpandedState[post._id] = false;
      });
      setExpandedPosts(initialExpandedState);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const toggleExpand = (postId) => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  useEffect(() => {
    fetchPosts();
  }, []);
  
  return (
    <div className='flex justify-center w-full overflow-y-auto'>
      <div className="container flex justify-center items-center flex-col py-4 mr-100">
        {posts?.map((post) => (
          <div 
            className="flex flex-col rounded-lg border border-gray-300 p-4 mb-4 w-full max-w-[500px] mx-auto" 
            key={post?._id}
          >
            <div className="flex items-center justify-between w-full bg-gray-100 px-2 py-2 rounded-lg px-2 mb-3">
              <div className="flex items-center space-x-3">
                <img 
                  className="w-10 h-10 rounded-lg object-cover border-2 border-gray-200" 
                  src={post?.author?.avatar || '/default-avatar.png'} 
                  alt={post?.author?.username} 
                />
                <h1 className="font-medium text-gray-800">
                  {post?.author?.username}
                </h1>
              </div>
            </div>

            <div className="px-2">
              <h2 className="text-lg font-semibold mb-2">{post?.title}</h2>
            
              <div className="relative">
                <p className={`text-gray-600 mb-3 w-full text-justify transition ${
                  expandedPosts[post._id] ? '' : 'line-clamp-2'
                }`}>
                  {post?.content}
                </p>
                {post?.content?.length > 100 && (
                  <button 
                    onClick={() => toggleExpand(post._id)}
                    className="text-blue-500 uppercase transition cursor-pointer hover:text-blue-700 mb-3 text-sm flex items-center justify-end w-full"
                  >
                    {expandedPosts[post._id] ? (
                      <>
                        Show less <ChevronUp className="ml-1 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Show more <ChevronDown className="ml-1 h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
              
              {post?.media?.length > 0 && (
                <div className="mb-3 rounded-md overflow-hidden">
                  <img 
                    src={post.media[0].image} 
                    alt="Post media" 
                    className="w-full h-auto max-h-[300px] object-cover"
                  />
                </div>
              )}
              
              {post?.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="text-xs bg-black text-white px-4 py-2 rounded-lg"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-2 pt-2 border-t border-gray-100">
              <button className="flex items-center justify-center bg-gray-100 w-[49%] bg-gray-100 rounded-lg cursor-pointer h-12 hover:text-white hover:bg-red-500 transition-colors">
                <Heart className="w-5 h-5 hover:text-white" />
              </button>
              <button className="flex items-center justify-center bg-gray-100 w-[49%] bg-gray-100 rounded-lg cursor-pointer h-12 hover:text-white hover:bg-blue-600 transition-colors">
                <Share2 className="w-5 h-5 hover:text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="w-[500px] h-[600px] bg-white fixed right-10 top-5 rounded-lg border"></div>
    </div>
  );
};

export default UserDashboard;