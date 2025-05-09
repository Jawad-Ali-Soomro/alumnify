import React, { useState } from "react";
import { Upload, X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const formSchema = yup.object({
  title: yup.string().required("Title is required"),
  content: yup.string().required("Content is required"),
  tags: yup.string().optional(),
  url: yup.string().url("Please enter a valid URL").optional(),
});

const AddPost = () => {
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(window.localStorage.getItem("user"));

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: "",
      url: "",
    },
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values) => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", values.content);
      formData.append("author", user._id);
      
      if (values.tags) {
        const tagsArray = values.tags.split(",").map(tag => tag.trim());
        formData.append("tags", JSON.stringify(tagsArray));
      }

      if (values.url) {
        formData.append("url", values.url);
      }

      images.forEach((image) => {
        formData.append("media", image);
      });

      await axios.post("http://localhost:8080/api/post/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Post created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center w-full items-center h-[90vh]">
      <div className="w-full max-w-[800px] mt-20 bg-white">
        <div className="p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              {/* <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Title
              </label> */}
              <Input 
                placeholder="Enter post title" 
                {...register("title")}
                className="cursor-text"
              />
              {errors.title && (
                <p className="text-sm font-medium text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              {/* <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Content
              </label> */}
              <Textarea 
                placeholder="Write your post content here..." 
                className="min-h-[100px] max-h-[100px] cursor-text"
                {...register("content")}
              />
              {errors.content && (
                <p className="text-sm font-medium text-destructive">{errors.content.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              {/* <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                URL (optional)
              </label> */}
              <Input 
                placeholder="https://example.com" 
                {...register("url")}
                className="cursor-text"
              />
              {errors.url && (
                <p className="text-sm font-medium text-destructive">{errors.url.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              {/* <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Tags (comma separated)
              </label> */}
              <Input 
                placeholder="tags - e.g., technology, programming, web" 
                {...register("tags")}
                className="cursor-text"
              />
              {errors.tags && (
                <p className="text-sm font-medium text-destructive">{errors.tags.message}</p>
              )}
            </div>

            <div className="space-y-2">
              {/* <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Images
              </label> */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-gray-600">
                    Click to upload images or drag and drop
                  </span>
                </label>
              </div>

              {previewImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {previewImages.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
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
              className="w-full h-12 uppercase cursor-pointer"
              disabled={loading}
            >
              {loading ? "Creating Post..." : "Create Post"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPost; 