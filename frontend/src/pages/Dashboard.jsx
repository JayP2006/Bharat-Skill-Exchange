import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import useAuthStore from '@/store/authStore';
import useSkillStore from '@/store/skillStore';
import api from '@/utils/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';
import { Star, IndianRupee, Calendar, Users, Edit, PlusCircle, Video, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// ✅ Recharts se zaroori components import karein
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- Sub-components ---

const StatsSection = ({ user, bookings, avgRating }) => {
    const totalEarnings = bookings.reduce((acc, booking) => acc + booking.totalAmount, 0);
    const totalStudents = new Set(bookings.map(b => b.shishya._id)).size;
    const getInitials = (name = '') => name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

    return (
        <div className="flex flex-col sm:flex-row gap-6 items-center">
            <Avatar className="h-20 w-20"><AvatarImage src={user.avatar} /><AvatarFallback className="text-3xl">{getInitials(user.name)}</AvatarFallback></Avatar>
            <div className="text-center sm:text-left">
                <h1 className="text-3xl font-bold">Welcome back, {user.name.split(' ')[0]} 👋</h1>
                <p className="text-muted-foreground">Here's your performance summary.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 sm:mt-0 sm:ml-auto w-full sm:w-auto">
                <Card className="text-center p-3"><Star className="mx-auto h-6 w-6 text-amber-400 mb-1" /><p className="text-xl font-bold">{avgRating.toFixed(1)}/5</p><p className="text-xs text-muted-foreground">Avg. Rating</p></Card>
                <Card className="text-center p-3"><IndianRupee className="mx-auto h-6 w-6 text-green-500 mb-1" /><p className="text-xl font-bold">{totalEarnings.toLocaleString('en-IN')}</p><p className="text-xs text-muted-foreground">Total Earnings</p></Card>
                <Card className="text-center p-3"><Calendar className="mx-auto h-6 w-6 text-blue-500 mb-1" /><p className="text-xl font-bold">{bookings.length}</p><p className="text-xs text-muted-foreground">Total Bookings</p></Card>
                <Card className="text-center p-3"><Users className="mx-auto h-6 w-6 text-indigo-500 mb-1" /><p className="text-xl font-bold">{totalStudents}</p><p className="text-xs text-muted-foreground">Unique Students</p></Card>
            </div>
        </div>
    );
};

const UpcomingSessions = ({ bookings, loading }) => {
    return (
        <Card>
            <CardHeader><CardTitle>My Bookings</CardTitle><CardDescription>All sessions booked by your learners.</CardDescription></CardHeader>
            <CardContent>
                {loading ? <div className="flex justify-center items-center h-24"><Loader2 className="h-6 w-6 animate-spin" /></div>
                : bookings.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">No sessions have been booked yet.</p>
                : <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {bookings.map(booking => (
                        <div key={booking._id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                            <div className="flex-grow"><p className="font-semibold">{booking.skill.title} with {booking.shishya.name}</p><p className="text-sm text-muted-foreground">{new Date(booking.startTime).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} - {booking.status}</p></div>
                            <Button variant="outline" size="sm"><Video className="mr-2 h-4 w-4" /> Join Now</Button>
                        </div>
                    ))}
                  </div>
                }
            </CardContent>
        </Card>
    );
};

const MySkills = ({ skills, loading }) => {
    const navigate = useNavigate();
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    {/* ✅ Text Change */}
                    <CardTitle>My Skills</CardTitle>
                    <CardDescription>Manage your offered skills.</CardDescription>
                </div>
                <Button onClick={() => navigate('/profile')}><PlusCircle className="mr-2 h-4 w-4" /> Add/Edit Skills</Button>
            </CardHeader>
            <CardContent>
                {loading ? <div className="flex justify-center items-center h-24"><Loader2 className="h-6 w-6 animate-spin" /></div>
                : skills.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">You haven't created any skills yet.</p>
                : <div className="space-y-4">
                    {skills.slice(0, 3).map(skill => ( // Sirf top 3 dikhayein
                        <div key={skill._id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                             <div className="flex-grow"><p className="font-semibold">{skill.title}</p><div className="flex items-center gap-4 text-sm text-muted-foreground"><span>₹{skill.hourlyRate}/hr</span><span className={`font-medium ${skill.mode === 'Online' ? 'text-green-500' : 'text-blue-500'}`}>{skill.mode}</span></div></div>
                             <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}><Edit className="mr-2 h-4 w-4" /> Manage</Button>
                        </div>
                    ))}
                  </div>
                }
            </CardContent>
        </Card>
    );
};

// ✅ Naya, Dynamic Earnings and Analytics Section
const EarningsAnalytics = ({ bookings }) => {
    // useMemo ka istemal karein taaki data sirf tab process ho jab bookings change hon
    const chartData = useMemo(() => {
        const monthlyEarnings = {};
        bookings.forEach(booking => {
            const month = new Date(booking.createdAt).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
            if (!monthlyEarnings[month]) {
                monthlyEarnings[month] = 0;
            }
            monthlyEarnings[month] += booking.totalAmount;
        });
        // Object ko recharts ke format mein convert karein
        return Object.keys(monthlyEarnings).map(month => ({
            name: month,
            Earnings: monthlyEarnings[month]
        })).reverse(); // Taaki sabse naya mahina pehle aaye
    }, [bookings]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Earnings & Analytics</CardTitle>
                <CardDescription>Your financial performance over time.</CardDescription>
            </CardHeader>
            <CardContent>
                {chartData.length > 0 ? (
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `₹${value/1000}k`} />
                                <Tooltip
                                    contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
                                    labelStyle={{ color: "hsl(var(--foreground))" }}
                                    formatter={(value) => [new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value), 'Earnings']}
                                />
                                <Legend iconSize={10} />
                                <Bar dataKey="Earnings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-80 bg-muted/50 rounded-lg flex flex-col items-center justify-center text-center">
                        <BarChart className="h-12 w-12 text-muted-foreground" />
                        <p className="mt-4 text-muted-foreground">No earnings data yet.</p>
                        <p className="text-xs text-muted-foreground">Your monthly earnings chart will appear here once you complete some bookings.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

// --- Main Dashboard Component ---
const Dashboard = () => {
  const { user } = useAuthStore();
  const { mySkills, loading: skillsLoading, fetchMySkills } = useSkillStore();
  const [guruBookings, setGuruBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [avgRating, setAvgRating] = useState(0);
  
  useEffect(() => {
    fetchMySkills();
    api.get('/bookings/guru')
       .then(res => setGuruBookings(res.data))
       .catch(err => console.error("Failed to fetch guru bookings", err))
       .finally(() => setBookingsLoading(false));
    api.get('/reviews/my-rating')
       .then(res => setAvgRating(res.data.averageRating || 0))
       .catch(err => console.error("Failed to fetch average rating", err));
  }, [fetchMySkills]);
  
  if (!user) {
    return <div className="text-center p-12"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>;
  }

  return (
    <motion.div className="space-y-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <StatsSection user={user} bookings={guruBookings} skills={mySkills} avgRating={avgRating} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-8">
            <UpcomingSessions bookings={guruBookings} loading={bookingsLoading} />
            <MySkills skills={mySkills} loading={skillsLoading} />
        </div>
        <div className="lg:sticky top-24">
            <EarningsAnalytics bookings={guruBookings} />
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;

