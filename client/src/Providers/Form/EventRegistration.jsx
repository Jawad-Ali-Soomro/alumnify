"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { format } from "date-fns";
import { CalendarIcon, ImageIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { cn } from "@/lib/utils";
import { uploadToPinata } from "@/Utils/uploadImage";
import axios from "axios";
import { BACKEND_HOST } from "@/Utils/constant";

export function CreateEventForm() {
  const [preview, setPreview] = useState(null);
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    isFree: false,
    category: "",
    startDate: null,
    endDate: null,
    price: "",
    url: "",
    image: null,
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setPreview(URL.createObjectURL(file));
        setFormData((prevData) => ({ ...prevData, image: file }));
      }
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = "";
      if (formData.image) {
        const uploadedImage = await uploadToPinata(formData.image);
        imageUrl = `https://gateway.pinata.cloud/ipfs/${uploadedImage.IpfsHash}`;
      }
      const finalData = { ...formData, image: imageUrl };

      const apiReq = await axios.post(`${BACKEND_HOST}/api/event`, finalData)
      console.log(apiReq.data)
      console.log("Final submitted data:", finalData);
    } catch (error) {
      console.error("Error uploading or submitting event:", error);
    }
  };

  const removeImage = () => {
    setFormData((prevData) => ({ ...prevData, image: null }));
    setPreview(null);
  };

  return (
    <Card className="p-6 max-w-3xl mx-auto mt-20 border-none shadow-none">
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Image Upload */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
            isDragActive
              ? "border-primary bg-primary/10"
              : "border-muted-foreground/30"
          }`}
        >
          <input {...getInputProps()} />
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="max-h-48 rounded-md mx-auto mb-2"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 p-1 h-8 w-8 rounded-full bg-red-500/80 hover:bg-red-500 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <ImageIcon className="h-10 w-10 mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {isDragActive
                  ? "Drop the image here"
                  : "Drag & drop an image, or click to select"}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                JPEG, PNG, WEBP (Max 5MB)
              </p>
            </div>
          )}
        </div>

        {/* Title */}
        <Input
          name="title"
          placeholder="Enter event title"
          value={formData.title}
          onChange={handleChange}
        />

        {/* Description */}
        <Textarea
          name="description"
          placeholder="Tell people what your event is about..."
          className="min-h-[120px]"
          value={formData.description}
          onChange={handleChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location */}
          <Input
            name="location"
            placeholder="Where is the event?"
            value={formData.location}
            onChange={handleChange}
          />

          {/* Category */}
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, category: value }))
            }
          >
            <SelectTrigger className={'w-[100%]'}>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="concert">Concert</SelectItem>
              <SelectItem value="conference">Conference</SelectItem>
              <SelectItem value="workshop">Workshop</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="exhibition">Exhibition</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          {/* Start Date */}
          <Popover open={openStart} onOpenChange={setOpenStart}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("pl-3 text-left font-normal", {
                  "text-muted-foreground": !formData.startDate,
                })}
              >
                {formData.startDate ? format(formData.startDate, "PPP") : "Pick a start date"}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.startDate}
                onSelect={(date) => setFormData((prev) => ({ ...prev, startDate: date }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* End Date */}
          <Popover open={openEnd} onOpenChange={setOpenEnd}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("pl-3 text-left font-normal", {
                  "text-muted-foreground": !formData.endDate,
                })}
              >
                {formData.endDate ? format(formData.endDate, "PPP") : "Pick an end date"}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.endDate}
                onSelect={(date) => setFormData((prev) => ({ ...prev, endDate: date }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Free/Paid */}
          <div className="flex flex-row items-center justify-between rounded-lg">
            <label className="text-base">Free Event</label>
            <Switch
              name="isFree"
              checked={formData.isFree}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, isFree: checked }))
              }
            />
          </div>

          {/* Price (Only if not free) */}
          {!formData.isFree && (
            <Input
              type="number"
              name="price"
              placeholder="Enter price"
              value={formData.price}
              onChange={handleChange}
            />
          )}

          {/* URL */}
          <Input
            name="url"
            placeholder="https://example.com"
            value={formData.url}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">Create Event</Button>
        </div>
      </form>
    </Card>
  );
}
