import React, { useState, useEffect } from 'react';
import useSkillStore from '@/store/skillStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { useForm, Controller } from 'react-hook-form';
import { Loader2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const SkillForm = ({ skillToEdit, onSuccess }) => {
  const isEditMode = !!skillToEdit;
  const { createSkill, updateSkill, loading } = useSkillStore();
  const [isLocating, setIsLocating] = useState(false);
  
  const { register, handleSubmit, watch, control, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: '', description: '', hourlyRate: '', tags: '', mode: 'Online', address: '', coordinates: '',
    }
  });

  useEffect(() => {
    if (isEditMode && skillToEdit) {
      reset({
        ...skillToEdit,
        tags: skillToEdit.tags?.join(', ') || '',
        coordinates: skillToEdit.location?.coordinates?.join(',') || '',
        address: skillToEdit.location?.address || ''
      });
    } else {
      reset({
        title: '', description: '', hourlyRate: '', tags: '', mode: 'Online', address: '', coordinates: '',
      });
    }
  }, [skillToEdit, isEditMode, reset]);

  const skillMode = watch('mode');

  const getLocation = () => {
    if (!navigator.geolocation) return toast.error("Geolocation is not supported by your browser.");
    setIsLocating(true);
    toast.loading("Fetching your location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        toast.dismiss();
        setValue('coordinates', `${position.coords.longitude},${position.coords.latitude}`, { shouldValidate: true });
        toast.success("Location fetched successfully!");
        setIsLocating(false);
      },
      () => {
        toast.dismiss();
        toast.error("Unable to retrieve your location. Please check browser permissions.");
        setIsLocating(false);
      }
    );
  };

  const onSubmit = async (formData) => {
    const skillPayload = new FormData();
    const mediaFiles = formData.media;
    console.log("Form Data Submitted:", formData);
    for (const key in formData) {
      if (key !== 'media') {
        skillPayload.append(key, formData[key]);
      }
    }
    
    if (mediaFiles && mediaFiles.length > 0) {
        for (let i = 0; i < mediaFiles.length; i++) {
            skillPayload.append('media', mediaFiles[i]);
        }
    }

    if (formData.mode === 'Online') {
      skillPayload.delete('address');
      skillPayload.delete('coordinates');
    }

    let result;
    if (isEditMode) {
      result = await updateSkill(skillToEdit._id, skillPayload);
    } else {
      result = await createSkill(skillPayload);
    }
    
    if (result && onSuccess) onSuccess(result);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
      <div className="grid gap-2"><Label htmlFor="title">Skill Title</Label><Input id="title" {...register("title", { required: "Title is required" })} />{errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}</div>
      <div className="grid gap-2"><Label htmlFor="description">Description</Label><Textarea id="description" {...register("description", { required: "Description is required" })} />{errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}</div>
      <div className="grid grid-cols-2 gap-4"><div className="grid gap-2"><Label htmlFor="hourlyRate">Hourly Rate (₹)</Label><Input id="hourlyRate" type="number" {...register("hourlyRate", { required: "Rate is required", valueAsNumber: true })} />{errors.hourlyRate && <p className="text-xs text-destructive">{errors.hourlyRate.message}</p>}</div><div className="grid gap-2"><Label htmlFor="tags">Tags (comma-separated)</Label><Input id="tags" {...register("tags")} /></div></div>
      <div className="grid gap-2"><Label>Skill Mode</Label><Controller name="mode" control={control} render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select mode" /></SelectTrigger><SelectContent><SelectItem value="Online">Online</SelectItem><SelectItem value="Offline">Offline (In-Person)</SelectItem></SelectContent></Select>)} /></div>
      {skillMode === 'Offline' && (<div className="space-y-4 border p-4 rounded-md bg-muted/50"><div className="grid gap-2"><Label htmlFor="address">Address / Landmark</Label><Input id="address" {...register("address", { required: skillMode === 'Offline' ? "Address is required" : false })} />{errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}</div><div className="grid gap-2"><Label>Location Coordinates</Label><Input readOnly placeholder="Click button to get coordinates" {...register("coordinates", { required: skillMode === 'Offline' ? "Coordinates are required" : false })} />{errors.coordinates && <p className="text-xs text-destructive">{errors.coordinates.message}</p>}<Button type="button" variant="outline" onClick={getLocation} disabled={isLocating}>{isLocating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MapPin className="mr-2 h-4 w-4" />} Get Current Location</Button></div></div>)}
      <div className="grid gap-2"><Label htmlFor="media">Cover Image (optional)</Label><Input id="media" type="file" accept="image/*" {...register("media")} /></div>
      <Button type="submit" className="w-full" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{isEditMode ? 'Save Changes' : 'Create Skill'}</Button>
    </form>
  );
};

export default SkillForm;