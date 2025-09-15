// src/components/Workshops/EditWorkshopModal.jsx

import React, { useState, useEffect } from "react";
import api from "@/utils/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Loader2 } from "lucide-react";

const EditWorkshopModal = ({ isOpen, onClose, workshop, onWorkshopUpdate }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  // Jab bhi naya workshop select ho, form ko uski details se bhar do
  useEffect(() => {
    if (workshop) {
      setFormData({
        title: workshop.title || "",
        description: workshop.description || "",
        dateTime: workshop.dateTime ? new Date(workshop.dateTime).toISOString().substring(0, 16) : "",
        durationMinutes: workshop.durationMinutes || 60,
        seatLimit: workshop.seatLimit || 10,
        price: workshop.price || 0,
        liveLink: workshop.liveLink || "",
      });
    }
  }, [workshop]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put(`/workshops/${workshop._id}`, formData);
      onWorkshopUpdate(res.data); // Parent component ko update data bhejo
      onClose(); // Modal band karo
    } catch (err) {
      console.error("Failed to update workshop", err);
      // Yahaan par error toast dikha sakte hain
    } finally {
      setLoading(false);
    }
  };

  if (!workshop) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Workshop</DialogTitle>
          <DialogDescription>
            Make changes to your workshop here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dateTime" className="text-right">Date & Time</Label>
            <Input id="dateTime" name="dateTime" type="datetime-local" value={formData.dateTime} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="durationMinutes" className="text-right">Duration (mins)</Label>
            <Input id="durationMinutes" name="durationMinutes" type="number" value={formData.durationMinutes} onChange={handleChange} className="col-span-3" required />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="seatLimit" className="text-right">Seat Limit</Label>
            <Input id="seatLimit" name="seatLimit" type="number" value={formData.seatLimit} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">Price (₹)</Label>
            <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="liveLink" className="text-right">Live Link</Label>
            <Input id="liveLink" name="liveLink" placeholder="https://meet.google.com/..." value={formData.liveLink} onChange={handleChange} className="col-span-3" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditWorkshopModal;
