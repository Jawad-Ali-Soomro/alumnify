import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BACKEND_HOST } from "@/Utils/constant";
import axios from "axios";
import {
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  Calendar,
  Heart,
  ChevronDown,
  ChevronUp,
  Share2,
  Link,
  Calendar as CalendarIcon,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Building } from "lucide-react";
import { Facebook } from "lucide-react";
import { Twitter } from "lucide-react";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [sharePost, setSharePost] = useState(null);
  const { userId } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(window.localStorage.getItem("user"));

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${BACKEND_HOST}/api/user/user/${userId}`);
      setUser(response.data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${BACKEND_HOST}/api/post/user/${userId}`);
      setPosts(response.data.posts);
      const initialExpandedState = {};
      response.data.posts.forEach((post) => {
        initialExpandedState[post._id] = false;
      });
      setExpandedPosts(initialExpandedState);
    } catch (error) {
      console.error("Error fetching posts:", error);
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
      await axios.post(`${BACKEND_HOST}/api/post/toggle/like/${postId}`, {
        userId: currentUser._id,
      });
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id === postId) {
            const alreadyLiked = post.likes.includes(currentUser._id);
            const updatedLikes = alreadyLiked
              ? post.likes.filter((id) => id !== currentUser._id)
              : [...post.likes, currentUser._id];
            return { ...post, likes: updatedLikes };
          }
          return post;
        })
      );
    } catch (err) {
      console.error("Error toggling like:", err);
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

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        User not found
      </div>
    );
  }

  return (
    <div className="mt-22 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Profile Card - Sticky on desktop */}
        <div className="lg:sticky lg:top-22 lg:h-fit lg:w-[400px]">
          <Card className="w-full shadow-sm">
            <CardHeader className="flex flex-col items-center gap-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h1 className="text-2xl font-bold">@{user.username}</h1>
                <Badge variant="secondary" className="mt-2 px-4 py-1">
                  {user.role}
                </Badge>
              </div>
            </CardHeader>
            <div className="w-full h-px bg-border" />
            <CardContent className="py-4 space-y-4">
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm truncate">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm">{user.phone}</span>
                </div>
              )}
              {user.university && (
                <div className="flex items-center gap-4">
                  <GraduationCap className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm">
                    {user.university} {user.graduationYear && `(${user.graduationYear})`}
                  </span>
                </div>
              )}
              {user.field && (
                <div className="flex items-center gap-4">
                  <Briefcase className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm">{user.field}</span>
                </div>
              )}
              {user.company && (
                <div className="flex items-center gap-4">
                  <Building className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm truncate">{user.company}</span>
                </div>
              )}
              <div className="flex items-center gap-4">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm">
                  Joined {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts Section */}
        <div className="flex-1">
          {posts.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No posts available
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-background rounded-lg border p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div 
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => navigate(`/user/${post.author._id}`)}
                    >
                      <img
                        className="w-10 h-10 rounded-lg border"
                        src={user.avatar || "/avatar.avif"}
                        alt={user.username}
                      />
                      <HoverCard>
                        <HoverCardTrigger className="text-sm font-medium">
                          @{user.username}
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="flex gap-3">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={user.avatar} />
                            </Avatar>
                            <div>
                              <h4 className="font-semibold">@{user.username}</h4>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {user.bio || "No bio available"}
                              </p>
                              <div className="flex items-center mt-2 text-xs text-muted-foreground">
                                <CalendarIcon className="w-3 h-3 mr-1" />
                                Joined {new Date(user.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
                    <div className="relative">
                      <p
                        className={`text-muted-foreground mb-3 text-justify ${
                          expandedPosts[post._id] ? "" : "line-clamp-2 "
                        }`}
                      >
                        {post.content}
                      </p>
                      {post.content?.length > 200 && (
                        <button
                          onClick={() => toggleExpand(post._id)}
                          className="text-primary text-sm flex items-center justify-end gap-1 uppercase text-end w-[99%]"
                        >
                          {expandedPosts[post._id] ? (
                            <>
                              Show less <ChevronUp className="w-4 h-4" />
                            </>
                          ) : (
                            <>
                              Show more <ChevronDown className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {post.media?.length > 0 && (
                    <div className="mb-3">
                      <div className={`grid gap-2 ${
                        post.media.length === 1 ? 'grid-cols-1' :
                        post.media.length === 2 ? 'grid-cols-2' :
                        post.media.length === 3 ? 'grid-cols-2' :
                        post.media.length === 4 ? 'grid-cols-2' :
                        'grid-cols-3'
                      }`}>
                        {post.media.slice(0, 5).map((media, index) => (
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
                                height: post.media.length === 1 ? '300px' :
                                       post.media.length === 2 ? '200px' :
                                       post.media.length === 3 && index === 0 ? '200px' :
                                       post.media.length === 4 && index === 0 ? '200px' :
                                       post.media.length > 4 && index === 0 ? '300px' : '150px'
                              }}
                              onClick={() => handleImageClick(media.image)}
                            />
                            {index === 4 && post.media.length > 5 && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                                <span className="text-white text-xl font-bold">+{post.media.length - 5}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-3 py-1 bg-secondary rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border p-2">
                    <button
                      onClick={() => handleLike(post._id)}
                      className={`flex items-center justify-center w-[50%] h-12  flex-1 py-2 rounded-lg transition-colors ${
                        isPostLikedByUser(post, currentUser._id) 
                        ? "bg-destructive text-white" 
                      : "bg-accent"
                      }`}
                    >
                       {isPostLikedByUser(post, currentUser._id) 
                                         ? <Heart className="w-5 h-5 icon" fill="white" /> 
                                         : <Heart className="w-5 h-5 icon" />}
                     
                    </button>
                   <button 
                                     onClick={() => setSharePost(post)}
                                     className="flex items-center justify-center bg-accent hover:bg-primary hover:text-primary-foreground w-[50%] rounded-lg cursor-pointer h-12 transition-colors"
                                   >
                                     <Share2 className="w-5 h-5 icon" />
                                   </button>
                    {post.url && (
                      <button 
                        onClick={() => window.open(post.url)}
                        className="flex items-center justify-center flex-1 py-2 rounded-lg text-muted-foreground hover:text-primary"
                      >
                        <Link className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Share Popup */}
      {sharePost && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setSharePost(null)}>
          <div 
            className="bg-background rounded-lg p-6 w-[90%] max-w-md mx-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-end mb-4">
              <button 
                onClick={() => setSharePost(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + `/post/${sharePost._id}`)}`, '_blank')}
                className="flex items-center justify-center gap-2 p-3 rounded-lg bg-blue-600 text-white"
              >
                <Facebook />
                <span>Facebook</span>
              </button>
              <button
                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.origin + `/post/${sharePost._id}`)}&text=${encodeURIComponent(sharePost.title)}`, '_blank')}
                className="flex items-center justify-center gap-2 p-3 rounded-lg bg-sky-500 text-white"
              >
                <Twitter />
                <span>Twitter</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onClick={handleCloseImage}>
          <div className="relative w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-[90vw] max-h-[90vh] object-contain"
              style={{ transform: `scale(${zoomLevel})` }}
            />
            <button
              onClick={handleCloseImage}
              className="absolute top-4 right-4 p-2 rounded-full bg-background text-foreground"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 bg-background/50 p-2 rounded-full backdrop-blur-sm">
              <button
                onClick={handleZoomOut}
                className="p-2 rounded-full hover:bg-accent"
                disabled={zoomLevel <= 0.5}
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={handleZoomIn}
                className="p-2 rounded-full hover:bg-accent"
                disabled={zoomLevel >= 3}
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;