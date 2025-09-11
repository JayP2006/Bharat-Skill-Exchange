import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Loader2 } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Shishya' });
  const { signup, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleRoleChange = (value) => setFormData({ ...formData, role: value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await signup(formData);
    if (success) {
      navigate('/profile');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-center justify-center py-12"
    >
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>Enter your information to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2"><Label htmlFor="name">Name</Label><Input id="name" name="name" placeholder="Max Robinson" required value={formData.name} onChange={handleChange} disabled={loading} /></div>
            <div className="grid gap-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" name="email" placeholder="m@example.com" required value={formData.email} onChange={handleChange} disabled={loading} /></div>
            <div className="grid gap-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" name="password" required value={formData.password} onChange={handleChange} disabled={loading} /></div>
            <div className="grid gap-2"><Label htmlFor="role">I want to</Label>
              <Select onValueChange={handleRoleChange} defaultValue={formData.role} disabled={loading}>
                <SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Shishya">Learn (as a Shishya)</SelectItem>
                  <SelectItem value="Guru">Teach (as a Guru)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Creating account..." : "Create an account"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">Already have an account?{" "}
            <Link to="/login" className="underline hover:text-primary">Login</Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Signup;