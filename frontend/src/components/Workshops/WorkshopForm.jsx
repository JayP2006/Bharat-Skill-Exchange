import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/utils/api';
import useSkillStore from '../../store/skillStore';

const WorkshopForm = ({ skillId, onSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const workshopData = {
        ...data,
        skill: skillId,
        dateTime: new Date(data.dateTime).toISOString(),
      };
     
      const response = await api.post('/workshops', workshopData);
      console.log(response);
      toast.success("Workshop created successfully!");
      if (onSuccess) onSuccess(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create workshop.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Create a New Workshop</CardTitle>
        <CardDescription>Schedule a session for your skill.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Title */}
          <div className="grid gap-2">
            <Label htmlFor="title">Workshop Title</Label>
            <Input id="title" {...register("title", { required: "Title is required" })} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description", { required: "Description is required" })} />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          {/* Seat Limit */}
          <div className="grid gap-2">
            <Label htmlFor="seatLimit">Seat Limit</Label>
            <Input type="number" id="seatLimit" {...register("seatLimit", { required: "Seat limit is required" })} />
            {errors.seatLimit && <p className="text-xs text-destructive">{errors.seatLimit.message}</p>}
          </div>

          {/* Duration */}
          <div className="grid gap-2">
            <Label htmlFor="durationMinutes">Duration (Minutes)</Label>
            <Input type="number" id="durationMinutes" {...register("durationMinutes", { required: "Duration is required" })} />
            {errors.durationMinutes && <p className="text-xs text-destructive">{errors.durationMinutes.message}</p>}
          </div>

          {/* Date & Time */}
          <div className="grid gap-2">
            <Label htmlFor="dateTime">Date & Time</Label>
            <Input type="datetime-local" id="dateTime" {...register("dateTime", { required: "Date & Time is required" })} />
            {errors.dateTime && <p className="text-xs text-destructive">{errors.dateTime.message}</p>}
          </div>

          {/* Live Session Link */}
          <div className="grid gap-2">
            <Label htmlFor="liveLink">Live Session Link (Optional)</Label>
            <Input type="url" id="liveLink" {...register("liveLink")} placeholder="https://zoom.us/..." />
          </div>

          {/* Pre-recorded Video URL */}
          <div className="grid gap-2">
            <Label htmlFor="videoUrl">Video URL (Optional)</Label>
            <Input type="url" id="videoUrl" {...register("videoUrl")} placeholder="https://youtube.com/..." />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Creating Workshop...' : 'Create Workshop'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WorkshopForm;
