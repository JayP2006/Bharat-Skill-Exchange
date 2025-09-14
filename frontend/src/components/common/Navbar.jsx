import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import { LogOut, User, LayoutDashboard, Bell, Sun, Moon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { useTheme } from '@/context/themeContext.jsx';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name = '') => name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  // Dynamically set navigation links based on user role
  let navLinks = [];
  if (user) {
    if (user.role === 'Guru') { // Note: 'Guru' might be 'guru' depending on your backend
      navLinks = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'My Profile', path: '/profile' },
        { name: 'Messages', path: '/chat' },
      ];
    } else { // Shishya
      navLinks = [
        { name: 'Learn Skills', path: '/skills' },
        { name: 'Chat with Gurus', path: '/chat' },
      ];
    }
  }

  // --- NEW: Component for the logo to keep code clean ---
  const Logo = () => (
    <div className="flex items-center space-x-2">
      <img src="/logo1.png" alt="Logo" className="h-8 w-8" />
      <span className="font-bold text-lg hidden sm:inline-block">ShikshaMudra</span>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all">
      <div className="container flex h-16 items-center">
        {/* --- CHANGE IS HERE --- */}
        {/* Conditionally render Link or a simple div based on user login status */}
        <div className="flex-shrink-0">
          {user ? (
            // If user is logged in, render a non-clickable div
            <div className="flex items-center space-x-2 cursor-default">
              <Logo />
            </div>
          ) : (
            // If user is logged out, render a clickable Link
            <Link to="/" className="flex items-center space-x-2">
              <Logo />
            </Link>
          )}
        </div>

        {/* Desktop Nav / Logged out statement */}
        <div className="flex-grow flex justify-center">
          {user ? (
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              {navLinks.map(link => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`
                    relative transition-all duration-300
                    hover:text-primary
                    ${location.pathname === link.path ? 'text-primary font-semibold' : 'text-muted-foreground'}
                  `}
                >
                  <span className="relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100">
                    {link.name}
                  </span>
                </Link>
              ))}
            </nav>
          ) : (
            <div className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground animate-fade-in">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>BharatSkill Connect, Where Shishya find there DHRUNACHARAYA</span>
            </div>
          )}
        </div>

        {/* Right Side */}
        <div className="flex-shrink-0 flex items-center space-x-2 sm:space-x-4">
          {/* Dark Mode Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="hover:scale-110 transition-transform duration-300">
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Notifications */}
          {user && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/notifications')}
              className="relative hover:scale-110 transition-transform duration-300"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 inline-flex h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-background"></span>
            </Button>
          )}

          {/* Auth Dropdown or Login/Signup */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:shadow-lg hover:bg-primary/10 transition-all duration-300">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>
                {user.role === 'Admin' && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Admin
                  </DropdownMenuItem>
                )}
                {user.role === 'Guru' && (
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            </div>
          )}

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Toggle Menu</span>
              <div className="space-y-1.5">
                <span className="block h-0.5 w-6 bg-current"></span>
                <span className="block h-0.5 w-6 bg-current"></span>
                <span className="block h-0.5 w-6 bg-current"></span>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t">
          <nav className="flex flex-col space-y-2 p-4">
            {user && navLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg py-2 rounded-md px-3"
              >
                {link.name}
              </Link>
            ))}
            {!user && (
              <div className="flex flex-col space-y-2 pt-4 border-t">
                <Button variant="ghost" className="w-full text-lg" onClick={() => {navigate('/login'); setMobileMenuOpen(false);}}>
                  Login
                </Button>
                <Button className="w-full text-lg" onClick={() => {navigate('/signup'); setMobileMenuOpen(false);}}>
                  Sign Up
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;