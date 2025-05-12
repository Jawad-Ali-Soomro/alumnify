import { BACKEND_HOST } from "@/Utils/constant";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { MapPin, Calendar, Plus, Search } from "lucide-react";
import { useNavigate } from 'react-router-dom'
import { RiCalendarCheckLine, RiCalendarCloseLine } from "react-icons/ri";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${BACKEND_HOST}/api/event/all`);
      setEvents(res.data.events);
      setFilteredEvents(res.data.events);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
  }, [searchQuery, events]);

  return (
    <div className="mb-20">
      {/* Header with Search - Non-fixed */}
      <div className="md:ml-20 p-6 flex flex-col md:flex-row justify-end items-start md:items-center gap-4 mt-20">
        <div className="relative w-full md:w-64">
          <div className="flex items-center border rounded-lg px-3 py-2 w-full">
            <Search className="h-6 w-6 mr-2 text-gray-500 icon" />
            <input
              id="search-input"
              type="text"
              placeholder="Search events..."
              className="outline-none w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                borderRadius: 0              }}
            />
            <kbd className="hidden md:inline-flex items-center text-black w-[65px] px-2 py-1 bg-gray-100 rounded text-xs ml-2">
              ⌘ + K
            </kbd>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 md:ml-20 lg:grid-cols-3 gap-6 p-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
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
                  <MapPin size={18} />
                </div>
                {event.location}
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
                {event.url && (
                  <div className="text-sm justify-end flex">
                    <button className="w-[150px] h-11 bg-[#333] text-white font-semibold cursor-pointer" onClick={() => window.location.replace(event.url)}>VISIT SITE</button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            {searchQuery ? "No events match your search" : "No events available"}
          </div>
        )}
      </div>

      <button 
        onClick={() => navigate('/admin/create/event')} 
        className="w-[50px] h-[50px] bg-[#333] text-white flex justify-center items-center fixed bottom-5 right-5 cursor-pointer rounded-full shadow-lg"
      >
        <Plus />
      </button>
    </div>
  );
};

export default Events;