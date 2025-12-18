import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import EventCard from '@/components/events/EventCard';
import { useEvents } from '@/context/EventContext';
import { useAuth } from '@/context/AuthContext';
import { Plus, Ticket, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function MyEvents() {
  const { events } = useEvents();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('attending');

  // Filter events based on User ID
  const attendingEvents = events.filter(e => e.attendees.includes(user?._id));
  const createdEvents = events.filter(e => e.createdBy === user?._id || e.createdBy?._id === user?._id);

  return (
    <div className="min-h-screen bg-[#F8F9FE]">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
             <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
             <p className="text-gray-500 mt-1">Manage your events and RSVPs</p>
          </div>
          <Link to="/create">
            <Button className="gap-2 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4"/> Create Event
            </Button>
          </Link>
        </div>

        {/* Custom Tab Switcher (Matches screenshot style) */}
        <div className="bg-gray-100 p-1 rounded-xl inline-flex mb-8">
            <button
                onClick={() => setActiveTab('attending')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === 'attending' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                <Ticket className="w-4 h-4" />
                Attending ({attendingEvents.length})
            </button>
            <button
                onClick={() => setActiveTab('created')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === 'created' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                <Calendar className="w-4 h-4" />
                Created ({createdEvents.length})
            </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'attending' && (
            attendingEvents.length > 0 ? (
              attendingEvents.map((event, idx) => <EventCard key={event._id} event={event} index={idx} />)
            ) : (
                <EmptyState 
                    icon={<Ticket className="w-6 h-6 text-gray-400" />}
                    title="No RSVPs yet"
                    description="Browse events to find something interesting!"
                    actionLink="/dashboard"
                    actionText="Browse Events"
                />
            )
          )}

          {activeTab === 'created' && (
            createdEvents.length > 0 ? (
              createdEvents.map((event, idx) => <EventCard key={event._id} event={event} index={idx} />)
            ) : (
                <EmptyState 
                    icon={<Calendar className="w-6 h-6 text-gray-400" />}
                    title="No events created"
                    description="Host your first event today!"
                    actionLink="/create"
                    actionText="Create Event"
                />
            )
          )}
        </div>
      </main>
    </div>
  );
}

// Helper component for empty states
function EmptyState({ icon, title, description, actionLink, actionText }) {
    return (
        <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
            <div className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-gray-50 mb-3">
                {icon}
            </div>
            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">{description}</p>
            <Link to={actionLink}>
                <Button variant="outline" size="sm">{actionText}</Button>
            </Link>
        </div>
    );
}