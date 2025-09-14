import React, { useState, useEffect } from 'react';
import useAuthStore from '@/store/authStore';
import useSkillStore from '@/store/skillStore';
import api from '@/utils/api';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import SkillForm from '@/components/Skills/SkillForm';
import WorkshopForm from '@/components/Workshops/WorkshopForm';
import { Button } from '@/components/ui/Button';
import { 
  PlusCircle, Loader2, MoreVertical, Edit, Trash2, CheckCircle, Clock, 
  IndianRupee, Globe, Video, BookOpen, Users, Calendar 
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/DropdownMenu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { useNavigate } from 'react-router-dom';

// --- Sub-components ---

const ProfileSkillCard = ({ skill, onEdit, onDelete }) => {
  const navigate = useNavigate();
  return (
    <Card className="overflow-hidden group hover-lift border-border/50">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-md font-semibold leading-tight">{skill.title}</CardTitle>
            <CardDescription className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1">
                <IndianRupee className="h-3 w-3" />{skill.hourlyRate}/hr
              </span>
              <span className={`flex items-center gap-1 font-medium ${skill.mode === 'Online' ? 'text-green-400' : 'text-blue-400'}`}>
                {skill.mode === 'Online' ? <Video className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
                {skill.mode}
              </span>
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/my-workshops?skillId=${skill._id}`)}>
                <BookOpen className="mr-2 h-4 w-4" /> 
                <span>Manage Content</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" /> <span>Edit Details</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                <Trash2 className="mr-2 h-4 w-4" /> <span>Delete Skill</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

const BookingCard = ({ booking, role }) => {
  const navigate = useNavigate();
  const isPending = booking.status === 'Pending';
  const otherUser = role === 'Guru' ? booking.shishya : booking.guru;

  const handleClick = () => {
    if (role === 'Shishya') {
      // Shishya ke liye MyWorkshops page pe redirect with skillId
      navigate(`/my-workshops?skillId=${booking.skill._id}`);
    } else {
      // Guru ke liye abhi jaise hai booking page
      navigate(`/booking/${booking.skill._id}`);
    }
  };

  return (
    <button 
      onClick={handleClick}
      className="w-full text-left transition-all duration-300 rounded-lg hover:bg-muted/80 hover-lift"
    >
      <div className="flex items-center p-4 gap-4 w-full">
        <Avatar className="h-12 w-12 border-2 border-border">
          <AvatarImage src={otherUser?.avatar} alt={otherUser?.name} />
          <AvatarFallback className="text-lg">{otherUser?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-grow space-y-0.5">
          <p className="font-semibold">{booking.skill.title}</p>
          <p className="text-sm text-muted-foreground">{role === 'Guru' ? `with ${otherUser?.name}` : `by ${otherUser?.name}`}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className={`flex items-center justify-end gap-1.5 text-xs font-semibold ${isPending ? 'text-orange-400' : 'text-green-400'}`}>
            {isPending ? <Clock className="h-3.5 w-3.5" /> : <CheckCircle className="h-3.5 w-3.5" />}
            {booking.status}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {new Date(booking.startTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </p>
        </div>
      </div>
    </button>
  );
};


// --- Main Profile Page Component ---

const Profile = () => {
  const { user, loading: userLoading } = useAuthStore();
  const { mySkills, loading: skillsLoading, fetchMySkills, deleteSkill } = useSkillStore();
  const [myBookings, setMyBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [openWorkshopSkillId, setOpenWorkshopSkillId] = useState(null);

  useEffect(() => {
    const loadData = () => {
      if (user) {
        if (user.role === 'Guru') {
          fetchMySkills();
          api.get('/bookings/guru').then(res => setMyBookings(res.data)).finally(() => setBookingsLoading(false));
        } else {
          api.get('/bookings/').then(res => setMyBookings(res.data)).finally(() => setBookingsLoading(false));
        }
      }
    };
    if (user) loadData();
  }, [user, fetchMySkills]);

  const getInitials = (name = '') => name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  const handleSuccess = () => {
    setShowCreateForm(false);
    setIsEditDialogOpen(false);
    setEditingSkill(null);
    fetchMySkills();
  };

  const handleEditClick = (skill) => {
    setEditingSkill(skill);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteClick = (skillId) => {
    if (window.confirm("Are you sure you want to delete this skill? This cannot be undone.")) {
      deleteSkill(skillId);
    }
  };

  if (userLoading || !user) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
      <div className="flex flex-col md:flex-row items-start gap-8">
        
        <Card className="w-full md:w-1/3 md:sticky top-24 hover-lift">
          <CardHeader className="items-center text-center p-8">
            <Avatar className="h-28 w-28 mb-4 border-4 border-primary/50">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-4xl">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
            <span className={`text-sm font-bold uppercase px-3 py-1 rounded-full mt-4 ${user.role === 'Guru' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-amber-500/10 text-amber-400'}`}>{user.role}</span>
          </CardHeader>
        </Card>

        <div className="w-full md:w-2/3 space-y-8">
          {user.role === 'Guru' && (
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BookOpen className="text-primary"/> Manage Your Content</CardTitle>
                <CardDescription>Add lessons to your skills/courses or create a new one.</CardDescription>
              </CardHeader>
              <CardContent>
                {skillsLoading ? (
                  <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin" /></div>
                ) : mySkills.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">You haven't added any skills yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mySkills.map(skill => (
                      <div key={skill._id} className="space-y-2">
                        <ProfileSkillCard 
                          skill={skill} 
                          onEdit={() => handleEditClick(skill)} 
                          onDelete={() => handleDeleteClick(skill._id)} 
                        />

                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setOpenWorkshopSkillId(prev => prev === skill._id ? null : skill._id)}
                        >
                          {openWorkshopSkillId === skill._id ? 'Cancel Workshop' : 'Add Workshop'}
                        </Button>

                        {openWorkshopSkillId === skill._id && (
                          <div className="mt-4">
                            <WorkshopForm 
                              skillId={skill._id} 
                              onSuccess={() => {
                                setOpenWorkshopSkillId(null);
                                fetchMySkills();
                              }} 
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                <Button className="w-full mt-6" variant="outline" onClick={() => setShowCreateForm(!showCreateForm)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> {showCreateForm ? 'Cancel' : 'Add New Skill'}
                </Button>
                {showCreateForm && <div className="mt-4"><SkillForm onSuccess={handleSuccess} /></div>}
              </CardContent>
            </Card>
          )}

          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {user.role === 'Guru' ? <Users className="text-primary"/> : <Calendar className="text-primary"/>}
                {user.role === 'Guru' ? 'Student Bookings' : 'My Bookings'}
              </CardTitle>
              <CardDescription>Your upcoming and past sessions.</CardDescription>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>
              ) : myBookings.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-10">You have no bookings.</p>
              ) : (
                <div className="space-y-2">
                  {myBookings.map(booking => <BookingCard key={booking._id} booking={booking} role={user.role} />)}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader><DialogTitle>Edit Skill</DialogTitle></DialogHeader>
          <SkillForm skillToEdit={editingSkill} onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Profile;
