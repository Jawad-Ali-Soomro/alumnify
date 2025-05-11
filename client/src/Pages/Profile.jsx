import { Input } from "@/components/ui/input";
import { BACKEND_HOST } from "@/Utils/constant";
import axios from "axios";
import { Info } from "lucide-react";
import { Check } from "lucide-react";
import { Mail, Plus, Phone, User, Briefcase, GraduationCap, MapPin, Save, CheckCheck } from "lucide-react";
import React from "react";
import { useEffect, useState } from "react";
import { GiConfirmed } from "react-icons/gi";

const Profile = () => {
  const [userInfo, setInfo] = useState({});
  const [tempInfo, setTempInfo] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const user = JSON.parse(window.localStorage.getItem("user"));
  const userId = user._id;
  
  const fetchInfo = async () => {
    const api = await axios.get(`${BACKEND_HOST}/api/user/user/${userId}`);
    setInfo(api.data.user);
    setTempInfo(api.data.user); // Initialize temp data with current user info
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
      window.location.reload()
      console.log(tempInfo)
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const renderEditableField = (field, icon, placeholder) => {
    return (
      <div className="flex justify-between items-center gap-2">
        <div className="icon flex p-2 bg-background border rounded-full">
          {icon}
        </div>
        {isEditing ? (
          <Input
            type="text"
            value={tempInfo[field] || ""}
            onChange={(e) => handleInputChange(field, e.target.value)}
            placeholder={placeholder}
            className="w-[70%] h-10 rounded-lg px-2 border"
          />
        ) : (
          <span className="text-start w-[100%] text-sm truncate">{userInfo[field] || `No ${field} added`}</span>
        )}
          <div 
            className="icon flex p-2 bg-background border rounded-full cursor-pointer"
            onClick={startEditing}
          >{
            userInfo[field] ? <Check size={15} /> : 
            <Plus size={15} />
          }
          </div>
        
      </div>
    );
  };

  return (
    <div className="flex justify-center items-center w-[100%] mt-20">
      <div className="left-side flex flex-col p-4 border rounded-[20px] shadow-lg gap-2 w-[400px]">
        <div className="image flex">
          <img src={userInfo.avatar} className="w-[100%] rounded-[20px]" alt="" />
        </div>
        <div className="flex w-[90%] ml-[5%] bg-gray-200 h-[1px]"></div>
        <div className="info flex flex-col gap-2 mt-2">
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
                className="flex items-center justify-center gap-2 px-4 w-[100%] py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Save size={18} />
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