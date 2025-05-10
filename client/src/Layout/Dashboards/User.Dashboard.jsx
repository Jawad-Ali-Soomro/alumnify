import { Heart, ChevronDown, ChevronUp, Share2, MoreVertical, Link, CalendarIcon, User, ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Facebook, Twitter, Linkedin, Link2, Copy, UserPlus, BellOff, Bookmark, Flag, Pencil, Trash2, AlertTriangle } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { HoverCard } from "@radix-ui/react-hover-card";
import { Skeleton } from "@/components/ui/skeleton";

const PostSkeleton = () => (
  <div className="flex flex-col rounded-lg border border-gray-300 p-4 mb-4 w-[95%] md:w-full max-w-[800px] mx-auto">
    <div className="flex items-center justify-between w-full px-2 py-2 mb-3">
      <div className="flex items-center space-x-3">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>

    <div className="px-2">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-2/3 mb-3" />
      
      <div className="grid grid-cols-2 gap-2 mb-3">
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <Skeleton className="h-6 w-16 rounded-lg" />
        <Skeleton className="h-6 w-20 rounded-lg" />
        <Skeleton className="h-6 w-14 rounded-lg" />
      </div>
    </div>

    <div className="flex items-center justify-between px-2 pt-2 border-t border-gray-100">
      <Skeleton className="h-12 w-[33%] rounded-lg" />
      <Skeleton className="h-12 w-[33%] rounded-lg" />
      <Skeleton className="h-12 w-[33%] rounded-lg" />
    </div>
  </div>
);

const SharePopup = ({ isOpen, onClose, post }) => {
  const postUrl = window.location.origin + `/post/${post?._id}`;

  const shareOptions = [
    {
      name: 'Facebook',
      icon: <Facebook className="w-5 h-5" />,
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`, '_blank')
    },
    {
      name: 'Twitter',
      icon: <Twitter className="w-5 h-5" />,
      color: 'bg-sky-500 hover:bg-sky-600',
      onClick: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post?.title)}`, '_blank')
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="w-5 h-5" />,
      color: 'bg-blue-700 hover:bg-blue-800',
      onClick: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`, '_blank')
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
      <div 
        className="bg-white rounded-lg p-6 w-[90%] max-w-md mx-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Share Post</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {shareOptions.map((option, index) => (
            <button
              key={index}
              onClick={option.onClick}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg text-white ${option.color} transition-colors`}
            >
              {option.icon}
              <span>{option.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, postTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
      <div 
        className="bg-white rounded-lg p-6 w-[90%] max-w-md mx-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <h3 className="text-lg font-semibold">Delete Post</h3>
        </div>
        
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this post? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const UserDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sharePost, setSharePost] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);
  const user = JSON.parse(window.localStorage.getItem("user"));
  const [deletePostId, setDeletePostId] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/post/all");
      setPosts(response.data.posts);
      const initialExpandedState = {};
      response.data.posts.forEach((post) => {
        initialExpandedState[post._id] = false;
      });
      setExpandedPosts(initialExpandedState);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const isPostLikedByUser = (post, userId) => {
    return post.likes?.includes(userId);
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(`http://localhost:8080/api/post/toggle/like/${postId}`, {
        userId: user._id,
      });
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id === postId) {
            const alreadyLiked = post.likes.includes(user._id);
            const updatedLikes = alreadyLiked
              ? post.likes.filter((id) => id !== user._id)
              : [...post.likes, user._id];

            return { ...post, likes: updatedLikes };
          }
          return post;
        })
      );
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleAddFriend = async (userId) => {
    console.log("Add friend:", userId);
  };

  const handleMuteUser = async (userId) => {
    console.log("Mute user:", userId);
  };

  const handleSavePost = async (postId) => {
    console.log("Save post:", postId);
  };

  const handleReportPost = async (postId) => {
    console.log("Report post:", postId);
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/post/${postId}`, {
        data: { userId: user._id }
      });

      if (response.data.success) {
        setPosts(posts.filter(post => post._id !== postId));
        setOpenMenuId(null);
        setDeletePostId(null);
      } else {
        console.error("Error deleting post:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleUpdatePost = (post) => {
    console.log("Update post:", post);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setZoomLevel(1);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
    setZoomLevel(1);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex justify-center w-full overflow-y-auto">
      <div className="flex justify-center items-center flex-col mt-20 py-4 w-full max-w-[800px] mx-auto">
        {loading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : posts?.length === 0 ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : (
          posts?.map((post) => (
            <div
              className="flex flex-col rounded-lg border border-gray-300 p-4 mb-4 w-[95%] md:w-full max-w-[800px] mx-auto"
              key={post?._id}
            >
              <div className="flex items-center justify-between w-full px-2 py-2 mb-3">
                <div className="flex items-center space-x-3 cursor-pointer ">
                  <img
                    className="w-10 h-10 rounded-lg border bg-white"
                    src={post?.author?.avatar || "/avatar.avif"}
                    alt={post?.author?.username}
                  />
                  <HoverCard>
                    <HoverCardTrigger>@{post?.author?.username}</HoverCardTrigger>
                    <HoverCardContent className={"flex w-[300px] mt-2 ml-25"}>
                      <Avatar className={"w-[50px] h-[50px] rounded-lg border"}>
                        <AvatarImage src={post?.author?.avatar}></AvatarImage>
                      </Avatar>
                      <div className="space-y-1 mt-4 ml-2">
                        <h4 className="text-sm font-semibold">
                          @{post?.author?.username}
                        </h4>
                        <p className="text-sm mt-2 text-justify">
                          {post?.author?.bio || "No biography is available - this may indicate that user is new."}
                        </p>
                        <div className="flex items-center pt-2">
                          <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                          <span className="text-xs text-muted-foreground">
                            {"Joined " + new Date(post?.author?.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                  <div className="flex items-center justify-end relative" ref={menuRef}>
                    <button 
                      onClick={() => setOpenMenuId(openMenuId === post._id ? null : post._id)}
                      className="text-gray-500 hover:text-gray-700 w-[35px] border flex justify-center py-2 rounded-lg cursor-pointer"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                    
                    {openMenuId === post._id && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border z-50">
                        <div className="py-1">
                          {user?._id === post?.author?._id ? (
                            <>
                              <button
                                onClick={() => handleUpdatePost(post)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Pencil className="w-4 h-4 mr-2" />
                                Update Post
                              </button>
                              <button
                                onClick={() => {
                                  setDeletePostId(post._id);
                                  setOpenMenuId(null);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Post
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleAddFriend(post.author._id)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <UserPlus className="w-4 h-4 mr-2" />
                                Add Friend
                              </button>
                              <button
                                onClick={() => handleMuteUser(post.author._id)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <BellOff className="w-4 h-4 mr-2" />
                                Mute User
                              </button>
                              <button
                                onClick={() => handleSavePost(post._id)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Bookmark className="w-4 h-4 mr-2" />
                                Save Post
                              </button>
                              <button
                                onClick={() => handleReportPost(post._id)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Flag className="w-4 h-4 mr-2" />
                                Report Post
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
              
              </div>

              <div className="px-2">
                <h2 className="text-lg mb-2">{post?.title}</h2>
                <div className="relative">
                  <p
                    className={`text-gray-600 mb-3 w-full text-justify transition ${
                      expandedPosts[post._id] ? "" : "line-clamp-2"
                    }`}
                  >
                    {post?.content}
                  </p>
                  {post?.content?.length > 200 && (
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
                  <div className={`mb-3 rounded-md overflow-hidden ${post.content?.length > 200 ? "" : "mt-5"}`}>
                    <div className={`grid gap-2 ${
                      post.media.length === 1 ? 'grid-cols-1' :
                      post.media.length === 2 ? 'grid-cols-2' :
                      post.media.length === 3 ? 'grid-cols-2' :
                      post.media.length === 4 ? 'grid-cols-2' :
                      'grid-cols-3'
                    }`}>
                      {post.media.map((media, index) => (
                        <div 
                          key={index} 
                          className={`relative ${
                            post.media.length === 3 && index === 0 ? 'col-span-2' :
                            post.media.length === 4 && index === 0 ? 'col-span-2' :
                            post.media.length > 4 && index === 0 ? 'col-span-2 row-span-2' : ''
                          }`}
                        >
                          <img
                            src={media.image}
                            alt={`Post media ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                            style={{
                              height: post.media.length === 1 ? '500px' :
                                     post.media.length === 2 ? '300px' :
                                     post.media.length === 3 && index === 0 ? '300px' :
                                     post.media.length === 4 && index === 0 ? '300px' :
                                     post.media.length > 4 && index === 0 ? '500px' : '150px'
                            }}
                            onClick={() => handleImageClick(media.image)}
                          />
                          {post.media.length > 4 && index === 4 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                              <span className="text-white text-2xl font-bold">+{post.media.length - 4}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {post?.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-gray-100 cursor-pointer text-black px-4 py-2 rounded-lg"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between px-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => handleLike(post._id)}
                  className={`flex items-center justify-center w-[33%] h-12 rounded-lg cursor-pointer transition-colors 
                    ${isPostLikedByUser(post, user._id) ? "bg-red-500 text-white" : "bg-gray-100 hover:bg-red-500 hover:text-white"}`}
                >
                  {isPostLikedByUser(post, user._id) ? <Heart className="w-5 h-5" fill="white" /> : <Heart className="w-5 h-5" />}
                </button>
                <button 
                  onClick={() => setSharePost(post)}
                  className="flex items-center justify-center bg-gray-100 w-[33%] rounded-lg cursor-pointer h-12 hover:text-white hover:bg-blue-600 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => window.open(post?.media[0]?.url || post?.url)}
                  className="flex items-center justify-center bg-gray-100 w-[33%] rounded-lg cursor-pointer h-12 hover:text-white hover:bg-blue-600 transition-colors"
                >
                  <Link className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Share Popup */}
      <SharePopup 
        isOpen={!!sharePost} 
        onClose={() => setSharePost(null)} 
        post={sharePost}
      />

      {/* Full Screen Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onClick={handleCloseImage}>
          <div className="relative w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-[90%] max-h-[90%] object-contain transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel})` }}
            />
            <button
              onClick={handleCloseImage}
              className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 bg-black/50 p-2 rounded-full">
              <button
                onClick={handleZoomOut}
                className="text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                disabled={zoomLevel <= 0.5}
              >
                <ZoomOut className="w-6 h-6" />
              </button>
              <button
                onClick={handleZoomIn}
                className="text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                disabled={zoomLevel >= 3}
              >
                <ZoomIn className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={!!deletePostId}
        onClose={() => setDeletePostId(null)}
        onConfirm={() => handleDeletePost(deletePostId)}
        postTitle={posts.find(p => p._id === deletePostId)?.title}
      />
    </div>
  );
};

export default UserDashboard;
