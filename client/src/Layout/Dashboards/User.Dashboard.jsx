import { Heart, ChevronDown, ChevronUp, Share2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { HoverCard } from "@radix-ui/react-hover-card";
import { HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon } from "lucide-react";
import { MoreVertical } from "lucide-react";
import { Link } from "lucide-react";
import { RiAddBoxLine, RiUserAddLine } from "react-icons/ri";

const UserDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [expandedPosts, setExpandedPosts] = useState({});
  const user = JSON.parse(window.localStorage.getItem("user"));
  console.log(user);
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

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="flex justify-center w-full overflow-y-auto">
      <div className="flex justify-center items-center flex-col py-4 mr-100">
        {posts?.map((post) => (
          <div
            className="flex flex-col rounded-lg border border-gray-300 p-4 mb-4 w-full max-w-[600px] mx-auto"
            key={post?._id}
          >
            <div className="flex items-center justify-between w-full rounded-lg px-2 py-2 rounded-lg px-2 mb-3">
              <div className="flex items-center space-x-3 cursor-pointer ">
                <img
                  className="w-10 h-10 rounded-lg border bg-white"
                  src={post?.author?.avatar || "/default-avatar.png"}
                  alt={post?.author?.username}
                />
                <HoverCard className="w-[500px]">
                  <HoverCardTrigger>@{post?.author?.username}</HoverCardTrigger>
                  <HoverCardContent className={"flex w-[300px] mt-2 ml-25"}>
                    <Avatar className={"w-[50px] h-[50px] rounded-lg border"}>
                      <AvatarImage src={post?.author?.avatar}></AvatarImage>
                    </Avatar>
                    <div className="space-y-1 mt-4 ml-2">
                      <h4 className="text-sm font-semibold">
                        {" "}
                        @{post?.author?.username}
                      </h4>
                      <p className="text-sm mt-2">
                        {post?.author?.bio || "No bio available - May be this is new user."}
                      </p>
                      <div className="flex items-center pt-2">
                        <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
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
             {
              user?._id !== post?.author?._id && (
                <div className="flex items-center justify-end">
                  <button className="text-gray-500 hover:text-gray-700 w-[35px] border flex justify-center py-2 rounded-lg cursor-pointer">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              )
             }
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
                  {post.tags.map((tag) => (
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
              <button className="flex items-center justify-center bg-gray-100 w-[33%] bg-gray-100 rounded-lg cursor-pointer h-12 hover:text-white hover:bg-red-500 transition-colors">
                <Heart className="w-5 h-5 hover:text-white" />
              </button>
              <button className="flex items-center justify-center bg-gray-100 w-[33%] bg-gray-100 rounded-lg cursor-pointer h-12 hover:text-white hover:bg-blue-600 transition-colors">
                <Share2 className="w-5 h-5 hover:text-white" />
              </button>
              <button className="flex items-center justify-center bg-gray-100 w-[33%] bg-gray-100 rounded-lg cursor-pointer h-12 hover:text-white hover:bg-blue-600 transition-colors">
                <Link className="w-5 h-5 hover:text-white" />
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
