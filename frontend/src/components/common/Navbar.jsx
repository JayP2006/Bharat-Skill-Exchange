import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import { LogOut, User, LayoutDashboard, MessageSquare } from 'lucide-react';
// Assuming you have these shadcn/ui components in components/ui/
import { Button } from '@/components/ui/Button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/DropdownMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const getInitials = (name = '') => name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-auto flex items-center">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <img src="/logo.svg" alt="Logo" className="h-6 w-6" />
            <span className="font-bold hidden sm:inline-block">BharatSkill</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link to="/skills" className="transition-colors hover:text-primary">Find Gurus</Link>
          </nav>
        </div>
        <div className="flex items-center justify-end space-x-2 sm:space-x-4">
          {user ? (
            <>
              <Button variant="ghost" size="icon" onClick={() => navigate('/chat')}><MessageSquare className="h-5 w-5" /></Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}><User className="mr-2 h-4 w-4" /><span>Profile</span></DropdownMenuItem>
                   {user.role === 'Admin' && (<DropdownMenuItem onClick={() => navigate('/admin')}><LayoutDashboard className="mr-2 h-4 w-4" /><span>Dashboard</span></DropdownMenuItem>)}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}><LogOut className="mr-2 h-4 w-4" /><span>Log out</span></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <nav className="flex items-center space-x-2">
              <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
              <Button onClick={() => navigate('/signup')}>Sign Up</Button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};
export default Navbar;