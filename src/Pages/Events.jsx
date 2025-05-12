import { BACKEND_HOST } from "@/Utils/constant";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { MapPin } from "lucide-react";
import { Calendar } from "lucide-react";
import { Plus } from "lucide-react";
import { useNavigate } from 'react-router-dom'
import { CalendarCheck } from "lucide-react";
import { RiCalendarCheckLine, RiCalendarCloseLine } from "react-icons/ri";

const Events = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate()

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${BACKEND_HOST}/api/event/all`);
      setEvents(res.data.events);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:ml-20 mt-20 lg:grid-cols-3 gap-6 p-6 mb-20">
      {events.map((event) => (
        <div
          key={event._id}
          className="border rounded-lg shadow p-4 flex flex-col gap-4 min-h-[600px] relative"
        >
          {/* Image */}
          {event.image && (
            <img
              src={event.image}
              alt={event.title}
              className="h-48 w-full object-cover rounded-md"
            />
          )}

          {/* Title & Description */}
          <div>
            <h2 className="text-xl font-semibold">{event.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {event.description}
            </p>
          </div>

          {/* Location */}
          <div className="text-sm flex gap-2 items-center truncate h-10 justify-start">
            <div className="w-[40px] h-[40px] border flex items-center justify-center">
                <MapPin size={18} /></div>{event.location}
          </div>

          {/* Dates */}
          <div className="text-sm flex flex-col flex gap-4">
            <span className="flex items-center gap-2">
               <div className="flex w-[40px] items-center justify-center border h-[40px]">
                 <RiCalendarCheckLine className="icon" size={18} />
               </div>
              {event.startDate ? format(new Date(event.startDate), "PPP") : "N/A"}
            </span>
           <span className="flex items-center gap-2">
               <div className="flex w-[40px] items-center justify-center border h-[40px]">
                 <RiCalendarCloseLine className="icon" size={18} />
               </div>
              {event.startDate ? format(new Date(event.endDate), "PPP") : "N/A"}
            </span>
          </div>

          {/* Free or Paid */}
         <div className="flex flex-col gap-1 absolute bottom-5 right-5">
             <div className="text-sm justify-end flex">
            {event.isFree ? (
              <span className=" bg-green-500 px-5 py-2 w-[150px] h-11 flex justify-center items-center uppercase text-white">Free</span>
            ) : (
              <span className=" bg-red-500 flex font-semibold w-[150px] h-11 py-3 justify-center items-center  text-white">PAID - ${event.price}</span>
            )}
          </div>
          {
            event.url && <div className="text-sm justify-end flex">
            <button className="w-[150px] h-11 bg-[#333] text-white font-semibold cursor-pointer" onClick={() => window.location.replace(event.url)}>VISIT SITE</button>
          </div>
          }
         </div>
        </div>
      ))}

      <button onClick={() => navigate('/admin/create/event')} className="w-[50px] h-[50px] bg-[#333] text-white flex justify-center items-center fixed bottom-5 right-5 cursor-pointer"><Plus /></button>
    </div>
  );
};

export default Events;
