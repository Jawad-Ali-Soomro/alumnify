import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Image as ImageIcon, Link as LinkIcon, Hash } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { uploadToPinata } from "@/Utils/uploadImage";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

const AddPost = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [url, setUrl] = useState("");
  const user = JSON.parse(window.localStorage.getItem("user"));
  const { theme, setTheme } = useTheme();

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleTagInput = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags((prev) => [...prev, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    try {
      setLoading(true);
      const media = [];
      for (const image of images) {
        try {
          const ipfsHash = await uploadToPinata(image.file);
          const imageUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash.IpfsHash}`;
          media.push({ image: imageUrl });
          toast.success(`Image uploaded successfully!`);
        } catch (error) {
          console.error("Error uploading image:", error);
          toast.error(`Failed to upload image: ${error.message}`);
        }
      }

      const postData = {
        title,
        content,
        author: user._id,
        ...(media.length > 0 && { media }),
        ...(url && { url }),
        ...(tags.length > 0 && { tags }),
      };

      const response = await axios.post(
        "http://localhost:8080/api/post",
        postData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Correct success check
      if (response.status === 200 || response.status === 201) {
        toast.success("Post created successfully!");
        navigate("/");
      } else {
        toast.error("Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error(error.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full py-8">
      <div className="max-w-[800px] mt-15 mx-auto px-4">
        <div className="rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-2">
            <div>
              <Input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg"
              />
            </div>
      
            <div>

  <Textarea
    placeholder="Write your post content..."
    value={content}
    onChange={(e) => setContent(e.target.value)}
    className="min-h-[200px] resize-none"
    maxLength={1000}
  />
  <div className={`text-right text-sm mt-4 mb-4 ${
    content.length > 800 ? 'text-orange-500' : 'text-muted-foreground'
  } ${
    content.length >= 998 ? 'font-semibold text-red-600' : ''
  }`}>
    {content.length}/1000 characters
    {content.length > 950 && content.length < 999 && ' (Approaching limit)'}
    {content.length > 999 && ' (Maximum reached)'}
  </div>
</div>

            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Input
                  type="url"
                  placeholder="Add URL (optional)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            </div>

            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Input
                  type="text"
                  placeholder="Add tags (press Enter to add)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInput}
                />
              </div>

      
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}

             
                </div>
              )}
            </div>

            <div>
              <div className="border border-dashed border-gray-300 rounded-lg p-4 mb-4 relative">
                <div className="flex flex-col items-center justify-center gap-2">
                  <ImageIcon className="w-5 h-5 text-gray-500" />
                  <p>Upload Images or drag images here to upload!</p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    style={{
                      opacity: 0,
                    }}
                    onChange={handleImageUpload}
                    className="cursor-pointer absolute h-[100%] w-[100%] left-0"
                  />
                </div>
              </div>
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={() => removeImage(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Uploading Post..." : "Upload Post"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPost;
