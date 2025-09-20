import React, { useEffect, useState } from "react";
import api from "@/utils/api";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Loader2, Calendar, Clock, BookOpen, PlayCircle, MoreVertical, FilePenLine, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

// Assuming EditWorkshopModal is in the same folder or a subfolder
import EditWorkshopModal from "./EditWorkshopModal"; 

// Corrected import path for dropdown-menu (usually lowercase)

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";


const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } } };

// Renamed component from MyWorkshops to WorkshopCard
const WorkshopCard = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  
  const role = localStorage.getItem("role");
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const skillId = params.get("skillId");

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        let res;
        if (skillId) {
          res = await api.get(`/workshops/skill/${skillId}`);
        } else if (role === 'Guru') {
          res = await api.get("/workshops/my-workshops");
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
  }, [skillId, role]);

  const handleEdit = (workshop) => {
    setSelectedWorkshop(workshop);
    setIsModalOpen(true);
  };

  const handleWorkshopUpdate = (updatedWorkshop) => {
    setWorkshops(currentWorkshops =>
      currentWorkshops.map(ws => 
        ws._id === updatedWorkshop._id ? updatedWorkshop : ws
      )
    );
  };

  const handleDelete = async (workshopId) => {
    if (window.confirm("Are you sure you want to permanently delete this workshop?")) {
      try {
        await api.delete(`/workshops/${workshopId}`);
        setWorkshops(currentWorkshops =>
          currentWorkshops.filter(ws => ws._id !== workshopId)
        );
        toast.success("Workshop deleted!");
      } catch (err) {
        console.error("Failed to delete workshop:", err);
        toast.error("Could not delete workshop.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (workshops.length === 0) {
    return <p className="text-center py-20 text-muted-foreground">No workshops found.</p>;
  }

  return (
    <>
      <motion.div
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 variants={itemVariants} className="text-3xl font-bold text-foreground">
          Workshops
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {workshops.map((ws) => (
            <motion.div
              key={ws._id}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02, boxShadow: "0 15px 30px hsl(var(--shadow-color, 0 0% 0% / 0.1))" }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="relative bg-card rounded-2xl shadow-sm border border-border p-6 flex flex-col justify-between transform-gpu"
            >
              {role === 'Guru' && (
                <div className="absolute top-4 right-4 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(ws)}>
                        <FilePenLine className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(ws._id)} className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              
              <div className="flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-card-foreground flex items-center gap-2 pr-10">
                  <BookOpen className="h-5 w-5 text-primary flex-shrink-0" />
                  {ws.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Skill: <span className="font-medium text-foreground">{ws.skill?.title}</span>
                </p>
                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary/80" />
                    {new Date(ws.dateTime).toLocaleDateString()}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary/80" />
                    {new Date(ws.dateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    {" • "} {ws.durationMinutes} mins
                  </p>
                </div>
              </div>

              <div className="mt-6">
                {ws.liveLink ? (
                  <a href={ws.liveLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 w-full justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition">
                    <PlayCircle className="h-5 w-5" /> Join Live
                  </a>
                ) : ws.videoUrl ? (
                  <video src={ws.videoUrl} controls className="mt-2 w-full rounded-lg shadow-sm" />
                ) : (
                  <p className="text-xs text-muted-foreground italic text-center pt-4">No content available</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <EditWorkshopModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        workshop={selectedWorkshop}
        onWorkshopUpdate={handleWorkshopUpdate}
      />
    </>
  );
};

export default WorkshopCard;
