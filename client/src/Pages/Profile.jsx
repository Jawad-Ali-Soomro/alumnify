import { Input } from "@/components/ui/input";
import { BACKEND_HOST } from "@/Utils/constant";
import axios from "axios";
import {  uploadToPinata } from "@/Utils/uploadImage"; //
import { Info, Check, Mail, Plus, Phone, User, Briefcase, GraduationCap, MapPin, Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Camera } from "lucide-react";

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
    setTempInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put(`${BACKEND_HOST}/api/user/update/${userId}`, tempInfo);
      setInfo(response.data.user);
      setIsEditing(false);
      window.localStorage.setItem("user", JSON.stringify(response.data.user))
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
      setTempInfo(prev => ({ ...prev, avatar: `https://gateway.pinata.cloud/ipfs/${imageUrl.IpfsHash}` })); 
    } catch (err) {
      console.error("Error uploading image:", err);
    } finally {
      setUploading(false);
    }
  };

  const renderEditableField = (field, icon, placeholder) => (
    <div className="flex justify-between items-center gap-2">
      <div className="rounded-full flex p-2 bg-background border rounded-full">
        {icon}
      </div>
      {isEditing ? (
        <Input
          type="text"
          value={tempInfo[field] || ""}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={placeholder}
          className="w-[100%] h-10 rounded-lg px-2 border"
        />
      ) : (
        <span className="text-start w-[100%] text-sm truncate">{userInfo[field] || `No ${field} added`}</span>
      )}
      <div 
        className="flex p-2 bg-background border rounded-full cursor-pointer"
        onClick={startEditing}
      >
        {userInfo[field] ? <Check size={15} /> : <Plus size={15} />}
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center w-[80%] ml-[10%] mt-20 flex-col min-h-[80vh]">
      <div className="left-side flex flex-col p-4 justify-between items-center border rounded-[20px] shadow-lg gap-2 w-[600px]">
        <div className="image flex flex-col items-center gap-2 relative">
          <img src={tempInfo.avatar || userInfo.avatar} className="w-[200px] image h-[200px] border rounded-full object-cover" alt="Avatar" />
          {isEditing && (
           <div className="flex items-center cursor-pointer z-10 w-[50px] h-[50px] bg-gray-200 flex items-center justify-center absolute bottom-0 right-0">
            <Camera className="icon" />
             <input 
              type="file" 
              accept="image/*" 
              style={{
                opacity: 0,
                position:'absolute',
                width:'100%',
                height:'100%'
              }}
              onChange={handleImageUpload} 
              className="w-full text-sm" 
            />
           </div>
          )}
          {uploading && <span className="text-xs text-gray-500">Uploading...</span>}
        </div>
        <div className="info flex flex-col gap-2 mt-2 w-[90%]">
          {renderEditableField("username", <User size={20} />, "Username")}
          {renderEditableField("email", <Mail size={20} />, "Email")}
          {renderEditableField("phone", <Phone size={20} />, "Phone Number")}
          {renderEditableField("bio", <Info size={20} />, "Short Bio")}
          <div className="flex w-[90%] ml-[5%] h-[1px] bg-gray-200 my-2"></div>
          {renderEditableField("field", <Briefcase size={20} />, "Profession")}
          {renderEditableField("company", <MapPin size={20} />, "Company")}
          {renderEditableField("university", <GraduationCap size={20} />, "University")}
          {renderEditableField("graduationYear", <GraduationCap size={20} />, "Graduation Year")}

          {isEditing && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleSaveChanges}
                className="flex items-center cursor-pointer justify-center gap-2 px-4 w-[100%] py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {/* <Save size={18} /> */}
                Apply Changes
              </button>
            </div>
          )}
          
          {!isEditing && (
            <div className="flex justify-center mt-4">
              <button
                onClick={startEditing}
                className="px-4 py-2 bg-gray-200 w-[100%] text-black rounded-lg hover:bg-gray-300 transition-colors"
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
