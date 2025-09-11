import React, { useState, useEffect } from 'react';
import useAuthStore from '@/store/authStore';
import useSkillStore from '@/store/skillStore';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import SkillForm from '@/components/Skills/SkillForm';
import { Button } from '@/components/ui/Button';
import { PlusCircle, Loader2, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/DropdownMenu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";

// Profile page ke liye ek special SkillCard jismein edit/delete options hain
const ProfileSkillCard = ({ skill, onEdit, onDelete }) => {
  return (
    <Card className="overflow-hidden group">
      <CardHeader className="flex flex-row items-start justify-between p-4">
        <div className="space-y-1">
            <CardTitle className="text-base leading-tight">{skill.title}</CardTitle>
            <CardDescription>₹{skill.hourlyRate}/hr - {skill.mode}</CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0"><MoreVertical className="h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}><Edit className="mr-2 h-4 w-4" /> <span>Edit</span></DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive focus:bg-destructive/10"><Trash2 className="mr-2 h-4 w-4" /> <span>Delete</span></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
    </Card>
  );
};

const Profile = () => {
  const { user, loading: userLoading } = useAuthStore();
  const { mySkills, loading: skillsLoading, fetchMySkills, deleteSkill } = useSkillStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null); // Edit kiye jaane wale skill ko store karne ke liye
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    if (user?.role === 'Guru') {
      fetchMySkills();
    }
  }, [user, fetchMySkills]);

  const getInitials = (name = '') => name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  // Jab bhi koi skill create ya update ho, is function ko call karein
  const handleSuccess = () => {
    setShowCreateForm(false);
    setIsEditDialogOpen(false);
    setEditingSkill(null);
    fetchMySkills(); // List ko refresh karein
  };

  const handleEditClick = (skill) => {
    setEditingSkill(skill);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteClick = (skillId) => {
    // Confirmation maangein
    if (window.confirm("Are you sure you want to delete this skill? This cannot be undone.")) {
      deleteSkill(skillId);
    }
  };

  if (userLoading) return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
      <div className="flex flex-col md:flex-row items-start gap-8">
        {/* Profile Info Card */}
        <Card className="w-full md:w-1/3 md:sticky top-24">
          <CardHeader className="items-center text-center">
            <Avatar className="h-24 w-24 mb-4"><AvatarImage src={user.avatar} alt={user.name} /><AvatarFallback className="text-3xl">{getInitials(user.name)}</AvatarFallback></Avatar>
            <CardTitle>{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
            <span className="text-xs font-semibold uppercase bg-primary/10 text-primary px-2 py-1 rounded-full mt-2">{user.role}</span>
          </CardHeader>
        </Card>

        {/* Right Side Content */}
        <div className="w-full md:w-2/3 space-y-8">
          {/* My Skills Section (Sirf Gurus ke liye) */}
          {user.role === 'Guru' && (
            <Card>
              <CardHeader>
                <CardTitle>My Skills</CardTitle>
                <CardDescription>Manage the skills you offer to the community.</CardDescription>
              </CardHeader>
              <CardContent>
                {showCreateForm ? (
                  <SkillForm onSuccess={handleSuccess} />
                ) : (
                  <>
                    {skillsLoading ? (
                      <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin" /></div>
                    ) : mySkills.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">You haven't added any skills yet.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mySkills.map(skill => 
                          <ProfileSkillCard key={skill._id} skill={skill} onEdit={() => handleEditClick(skill)} onDelete={() => handleDeleteClick(skill._id)} />
                        )}
                      </div>
                    )}
                    <Button className="w-full mt-6" variant="outline" onClick={() => setShowCreateForm(true)}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Add New Skill
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* My Bookings Section */}
          <Card>
            <CardHeader><CardTitle>My Bookings</CardTitle><CardDescription>Your upcoming and past sessions.</CardDescription></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground text-center py-4">You have no bookings.</p></CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Skill Dialog (Pop-up Modal) */}
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