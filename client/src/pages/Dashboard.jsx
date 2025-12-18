import { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import EventCard from '@/components/events/EventCard';
import EventFilters from '@/components/events/EventFilters';
import { useEvents } from '@/context/EventContext';
import { useAuth } from '@/context/AuthContext';
import { Plus, Calendar, Users, TrendingUp, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Dashboard() {
  const { events, fetchEvents } = useEvents();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  // Auto-refresh logic (every 2 minutes)
  useEffect(() => {
    fetchEvents();
    const intervalId = setInterval(() => {
      fetchEvents();
    }, 120000);
    return () => clearInterval(intervalId);
  }, []);

  // Calculate Stats (Includes past events for total count)
  const stats = useMemo(() => {
    const totalEvents = events.length;
    const totalAttendees = events.reduce((acc, curr) => acc + (curr.attendees?.length || 0), 0);
    const userEvents = events.filter(e => e.createdBy === user?._id).length;
    return { totalEvents, totalAttendees, userEvents };
  }, [events, user]);

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase()) || 
                          e.location.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category ? e.category === category : true;
    
    // NEW: Filter out past events
    // Create date objects setting time to 00:00:00 for accurate day comparison
    const eventDate = new Date(e.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const isUpcoming = eventDate >= today;

    return matchesSearch && matchesCategory && isUpcoming;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FE]">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
             <h1 className="text-3xl font-bold text-gray-900">
               Welcome back, <span className="text-primary">{user?.name?.split(' ')[0]}</span>
             </h1>
             <p className="text-gray-500 mt-1">Discover and join amazing events happening around you</p>
          </div>
          <Link to="/create">
            <Button className="gap-2 shadow-lg shadow-primary/20"><Plus className="w-4 h-4"/> Create Event</Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Calendar className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Total Events</p>
                    <h3 className="text-2xl font-bold text-gray-900">{stats.totalEvents}</h3>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                    <Users className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Total Attendees</p>
                    <h3 className="text-2xl font-bold text-gray-900">{stats.totalAttendees.toLocaleString()}</h3>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                    <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Your Events</p>
                    <h3 className="text-2xl font-bold text-gray-900">{stats.userEvents}</h3>
                </div>
            </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-6">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <Input 
                placeholder="Search events by title, location..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="w-full pl-11 h-12 bg-white border-gray-200 rounded-xl text-base shadow-sm focus:ring-primary/20"
            />
        </div>

        {/* Filters */}
        <EventFilters category={category} setCategory={setCategory} />
        
        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
            <div className="text-center py-20">
                <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No upcoming events found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, idx) => (
                <EventCard key={event._id} event={event} index={idx} />
            ))}
            </div>
        )}
      </main>
    </div>
  );
}