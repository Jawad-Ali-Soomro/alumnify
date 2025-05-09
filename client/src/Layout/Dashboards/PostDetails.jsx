import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, Share2, Link, X, ZoomIn, ZoomOut, Facebook, Twitter, Linkedin, Link2, Copy } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const SharePopup = ({ isOpen, onClose, post }) => {
  const [copied, setCopied] = useState(false);
  const postUrl = window.location.href;

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
    },
    {
      name: 'Copy Link',
      icon: copied ? <Copy className="w-5 h-5" /> : <Link2 className="w-5 h-5" />,
      color: 'bg-gray-600 hover:bg-gray-700',
      onClick: () => {
        navigator.clipboard.writeText(postUrl);
        setCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      }
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed top-[-100px] inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
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

        <div className="grid grid-cols-2 gap-3 mb-4">
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

        <div className="relative">
          <input
            type="text"
            value={postUrl}
            readOnly
            className="w-full p-2 pr-10 border rounded-lg bg-gray-50 text-sm"
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(postUrl);
              setCopied(true);
              toast.success("Link copied to clipboard!");
              setTimeout(() => setCopied(false), 2000);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {copied ? <Copy className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [sharePopup, setSharePopup] = useState(false);
  const user = JSON.parse(window.localStorage.getItem("user"));

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/post/${id}`);
        setPost(response.data.post);
      } catch (error) {
        console.error("Error fetching post:", error);
        toast.error("Failed to load post");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  const handleLike = async () => {
    try {
      await axios.post(`http://localhost:8080/api/post/toggle/like/${id}`, {
        userId: user._id,
      });
      setPost(prev => ({
        ...prev,
        likes: prev.likes.includes(user._id)
          ? prev.likes.filter(id => id !== user._id)
          : [...prev.likes, user._id]
      }));
    } catch (err) {
      console.error("Error toggling like:", err);
      toast.error("Failed to update like");
    }
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

  if (loading) {
    return (
      <div className="flex justify-center w-full min-h-screen">
        <div className="w-full max-w-[800px] mt-20 p-4">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3 mb-4" />
          <Skeleton className="h-96 w-full rounded-lg mb-4" />
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen w-full overflow-y-auto bg-gray-50">
      <div className="flex justify-center w-full py-8">
        <div className="w-full max-w-[800px] px-4">
          <div className="rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img
                  className="w-10 h-10 rounded-lg border bg-white"
                  src={post.author?.avatar || "/avatar.avif"}
                  alt={post.author?.username}
                />
                <div>
                  <h3 className="font-semibold">@{post.author?.username}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
            <p className="text-gray-600 mb-6 whitespace-pre-wrap">{post.content}</p>

            {post.media?.length > 0 && (
              <div className="mb-6">
                <div className={`grid gap-4 ${
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
                    </div>
                  ))}
                </div>
              </div>
            )}

            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  post.likes.includes(user._id)
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 hover:bg-red-500 hover:text-white"
                }`}
              >
                <Heart className="w-5 h-5" fill={post.likes.includes(user._id) ? "white" : "none"} />
                <span>{post.likes.length}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSharePopup(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
                {post.url && (
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
                  >
                    <Link className="w-5 h-5" />
                    <span>Visit</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Popup */}
      <SharePopup 
        isOpen={sharePopup} 
        onClose={() => setSharePopup(false)} 
        post={post}
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
    </div>
  );
};

export default PostDetails; 