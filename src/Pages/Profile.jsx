import { Input } from "@/components/ui/input";
import { BACKEND_HOST } from "@/Utils/constant";
import axios from "axios";
import { uploadToPinata } from "@/Utils/uploadImage";
import {
  Info,
  Check,
  Mail,
  Plus,
  Phone,
  User,
  Briefcase,
  GraduationCap,
  MapPin,
  Camera,
} from "lucide-react";
import React, { useEffect, useState } from "react";

const Profile = () => {
  const [userInfo, setInfo] = useState({});
  const [tempInfo, setTempInfo] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const user = JSON.parse(window.localStorage.getItem("user"));
  const userId = user._id;

  const fetchInfo = async () => {
    const api = await axios.get(`${BACKEND_HOST}/api/user/user/${userId}`);
    setInfo(api.data.user);
    setTempInfo(api.data.user);
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const handleInputChange = (field, value) => {
    setTempInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put(
        `${BACKEND_HOST}/api/user/update/${userId}`,
        tempInfo
      );
      setInfo(response.data.user);
      setIsEditing(false);
      window.localStorage.setItem("user", JSON.stringify(response.data.user));
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await uploadToPinata(file);
      setTempInfo((prev) => ({
        ...prev,
        avatar: `https://gateway.pinata.cloud/ipfs/${imageUrl.IpfsHash}`,
      }));
    } catch (err) {
      console.error("Error uploading image:", err);
    } finally {
      setUploading(false);
    }
  };

  const renderEditableField = (field, icon, placeholder, disabled = false) => (
    <div className="flex justify-between items-center gap-2">
      <div className="rounded-full flex p-2 bg-background border rounded-full">
        {icon}
      </div>
      {isEditing && !disabled ? (
        <Input
          type="text"
          value={tempInfo[field] || ""}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={placeholder}
          className="w-full h-10 rounded-lg px-2 border"
        />
      ) : (
        <span className="text-start w-full text-sm truncate">
          {userInfo[field] || `No ${field} added`}
        </span>
      )}
      <div
        className="flex p-2 bg-background border rounded-full cursor-pointer"
        onClick={!disabled ? startEditing : undefined}
      >
        {userInfo[field] ? <Check size={15} /> : <Plus size={15} />}
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center md:w-[80%] w-[96%] md:ml-[10%] ml-[2%] mt-20 flex-col min-h-[80vh]">
      <div className="left-side flex flex-col p-4 justify-between items-center rounded-[20px] gap-2 w-full">
        <div className="image flex flex-col items-center gap-2 relative">
          <img
            src={tempInfo.avatar || userInfo.avatar}
            className="w-[200px] h-[200px] border rounded-full"
            style={{
              borderRadius: '50%'
            }}
            alt="Avatar"
          />
          {isEditing && (
            <div className="flex items-center cursor-pointer z-10 w-[50px] h-[50px] bg-gray-200 justify-center absolute bottom-0 right-0 rounded-full">
              <Camera className="icon" />
              <input
                type="file"
                accept="image/*"
                style={{
                  opacity: 0,
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                }}
                onChange={handleImageUpload}
              />
            </div>
          )}
          {uploading && (
            <span className="text-xs text-gray-500">Uploading...</span>
          )}
        </div>

        <div className="info flex flex-col gap-2 mt-2 w-[90%]">
          {/* Non-editable username and email */}
          {renderEditableField("username", <User size={20}className="icon" />, "Username", true)}
          {renderEditableField("email", <Mail size={20}className="icon" />, "Email", true)}

          {/* Editable fields */}
          {renderEditableField("phone", <Phone size={20}className="icon" />, "Phone Number")}
          {renderEditableField("bio", <Info size={20}className="icon" />, "Short Bio")}
          <div className="flex w-[90%] ml-[5%] h-[1px] bg-gray-200 my-2"></div>
          {renderEditableField("field", <Briefcase size={20}className="icon" />, "Profession")}
          {renderEditableField("company", <MapPin size={20}className="icon" />, "Company")}
          {renderEditableField("university", <GraduationCap size={20}className="icon" />, "University")}
          {renderEditableField("graduationYear", <GraduationCap size={20}className="icon" />, "Graduation Year")}

          {/* Buttons */}
          {isEditing ? (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleSaveChanges}
                className="flex items-center cursor-pointer justify-center gap-2 px-4 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Apply Changes
              </button>
            </div>
          ) : (
            <div className="flex justify-center mt-4">
              <button
                onClick={startEditing}
                className="px-4 py-2 bg-gray-200 w-full text-black rounded-lg hover:bg-gray-300 transition-colors"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
