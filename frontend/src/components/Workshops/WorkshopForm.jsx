import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/utils/api'; // Assuming you create a workshopStore or use api directly

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
      const response = await api.post('/workshops', workshopData); // You should create a workshop route
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
        <CardDescription>Schedule a group session for your skill.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Workshop Title</Label>
            <Input id="title" {...register("title", { required: "Title is required" })} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>
          {/* ... other fields like description, price, seatLimit, durationMinutes, dateTime ... */}
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