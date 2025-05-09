import { Heart, ChevronDown, ChevronUp, Share2, MoreVertical, Link, CalendarIcon, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { HoverCard } from "@radix-ui/react-hover-card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

const UserDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [expandedPosts, setExpandedPosts] = useState({});
  const user = JSON.parse(window.localStorage.getItem("user"));
  const [users, setUsers] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/post/all");
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

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/user/all");
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    fetchPosts();
    fetchUsers();
  }, []);

  return (
    <div className="flex justify-center w-full overflow-y-auto">
      <div className="flex justify-center items-center flex-col mt-20 py-4 w-full max-w-[800px] mx-auto">
        {posts?.map((post) => (
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
              {user?._id !== post?.author?._id && (
                <div className="flex items-center justify-end">
                  <button className="text-gray-500 hover:text-gray-700 w-[35px] border flex justify-center py-2 rounded-lg cursor-pointer">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            <div className="px-2">
              <h2 className="text-lg font-semibold mb-2">{post?.title}</h2>
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
                <div className={`mb-3 rounded-md overflow-hidden ${post.content?.length > 100 ? "" : "mt-5"}`}>
                  <img
                    src={post.media[0].image}
                    alt="Post media"
                    className="w-full h-auto max-h-[300px] object-cover"
                  />
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
                {
                  isPostLikedByUser(post, user._id) ? <Heart className="w-5 h-5" fill="white" /> : <Heart className="w-5 h-5" />
                }
                
              </button>
              <button className="flex items-center justify-center bg-gray-100 w-[33%] rounded-lg cursor-pointer h-12 hover:text-white hover:bg-blue-600 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button onClick={() => (window.location.href = post?.media[0].url)} className="flex items-center justify-center bg-gray-100 w-[33%] rounded-lg cursor-pointer h-12 hover:text-white hover:bg-blue-600 transition-colors">
                <Link className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
