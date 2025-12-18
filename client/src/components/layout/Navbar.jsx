import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Plus, LogOut, LayoutDashboard, User, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <div className="p-1.5 bg-primary rounded-lg text-white">
            <Calendar className="h-5 w-5" />
          </div>
          
          <span>
            Event<span className="text-primary">Hive</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Dashboard Link */}
              <Link to="/dashboard" className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Link>

              {/* Create Event Button */}
              <Link to="/create">
                <Button size="sm" className="gap-2 shadow-sm">
                  <Plus className="h-4 w-4" /> Create Event
                </Button>
              </Link>

              {/* User Avatar Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold text-sm border border-indigo-200 hover:ring-2 hover:ring-indigo-100 transition-all focus:outline-none"
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </button>

                {isOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-200">
                    {/* User Header */}
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link 
                        to="/my-events" 
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <User className="h-4 w-4" /> My Events
                      </Link>
                    </div>

                    <div className="border-t border-gray-100 my-1"></div>

                    <div className="py-1">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut className="h-4 w-4" /> Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <Link to="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
              <Link to="/signup"><Button size="sm">Get Started</Button></Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}