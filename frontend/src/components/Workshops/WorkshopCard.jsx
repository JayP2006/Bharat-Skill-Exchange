import React, { useEffect, useState } from "react";
import api from "@/utils/api";
import { Loader2, Calendar, Clock, BookOpen, PlayCircle } from "lucide-react";
import { useLocation } from "react-router-dom";

const MyWorkshops = ({ userRole }) => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  // URL se skillId nikalna
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const skillId = params.get("skillId");

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        let res;
        if (true) {
          if (!skillId) {
            setLoading(false);
            return;
          }
          res = await api.get(`/workshops/skill/${skillId}`);
        } else {
          res = await api.get("/workshops/student");
        }
        setWorkshops(res.data);
      } catch (err) {
        console.error("ERROR FETCHING WORKSHOPS: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, [skillId, userRole]);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (workshops.length === 0) {
    return <p className="text-center py-10 text-muted-foreground">No workshops found.</p>;
  }

  return (
  <div className="space-y-6">
    {/* Section Title */}
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
      Workshops
    </h2>

    {/* Workshops Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workshops.map((ws) => (
        <div
          key={ws._id}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-md transition p-6 flex flex-col justify-between"
        >
          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            {ws.title}
          </h3>

          {/* Skill */}
          <p className="mt-2 text-sm text-muted-foreground">
            Skill: <span className="font-medium">{ws.skill?.title}</span>
          </p>

          {/* Date & Duration */}
          <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <p className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(ws.dateTime).toLocaleDateString()}
            </p>
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {new Date(ws.dateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} 
              {" • "} {ws.durationMinutes} mins
            </p>
          </div>

          {/* Actions */}
          <div className="mt-4">
            {ws.liveLink ? (
              <a
                href={ws.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 w-full justify-center rounded-lg bg-primary px-4 py-2 text-white text-sm font-medium hover:bg-primary/90 transition"
              >
                <PlayCircle className="h-4 w-4" /> Join Live
              </a>
            ) : ws.videoUrl ? (
              <video src={ws.videoUrl} controls className="mt-2 w-full rounded-lg shadow-sm" />
            ) : (
              <p className="text-xs text-muted-foreground italic">No live or recorded content</p>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
); 
};

export default MyWorkshops;
