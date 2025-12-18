import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { useEvents } from '@/context/EventContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Calendar, MapPin, Share2, Check, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function EventDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { deleteEvent } = useEvents();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState(false);

  const fetchEvent = async () => {
    try {
      const { data } = await api.get(`/events/${id}`);
      setEvent(data);
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to load event details", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvent(); }, [id]);

  const handleRSVP = async () => {
    if (!user) {
        toast({ title: "Please Login", description: "You need to be logged in to RSVP", variant: "destructive" });
        return navigate('/login');
    }

    setRsvpLoading(true);
    try {
      await api.put(`/events/${id}/rsvp`);
      toast({ title: "Success", description: "You have successfully RSVP'd!" });
      fetchEvent(); // Refresh to update capacity count immediately
    } catch (error) {
      toast({ title: "RSVP Failed", description: error.response?.data?.message, variant: "destructive" });
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleCancel = async () => {
    setRsvpLoading(true);
    try {
       await api.put(`/events/${id}/cancel`);
       toast({ title: "Cancelled", description: "RSVP removed" });
       fetchEvent();
    } catch (error) {
       toast({ title: "Error", variant: "destructive" });
    } finally {
        setRsvpLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event? This cannot be undone.")) {
        const success = await deleteEvent(event._id);
        if (success) navigate('/dashboard');
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  if (!event) return <div>Event not found</div>;

  const isAttending = event.attendees.includes(user?._id);
  const spotsTaken = event.attendees.length;
  const capacity = event.capacity;
  const isFull = spotsTaken >= capacity;
  // Check if current user is the creator (handles populated object or direct ID)
  const isOwner = user && (event.createdBy === user._id || event.createdBy?._id === user._id);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {/* Header Image */}
          <div className="relative h-64 md:h-96">
            <img src={event.imageUrl} className="w-full h-full object-cover" alt="Event" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
                <Badge className="bg-white/20 hover:bg-white/30 text-white border-none mb-2 capitalize px-3 py-1">
                    {event.category}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold">{event.title}</h1>
            </div>
          </div>
          
          <div className="p-8 grid md:grid-cols-3 gap-8">
            {/* Left Column: Details */}
            <div className="md:col-span-2 space-y-8">
                <div className="flex flex-wrap gap-6 text-gray-600">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 rounded-lg text-primary"><Calendar className="w-5 h-5"/></div>
                        <span className="font-medium">{new Date(event.date).toDateString()} at {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 rounded-lg text-primary"><MapPin className="w-5 h-5"/></div>
                        <span className="font-medium">{event.location}</span>
                    </div>
                </div>
                
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">About this event</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{event.description}</p>
                </div>

                {isOwner && (
                    <div className="p-4 bg-gray-50 border rounded-lg">
                        <h4 className="font-semibold mb-1">Host Controls</h4>
                        <p className="text-sm text-gray-500">You created this event.</p>
                    </div>
                )}
            </div>

            {/* Right Column: RSVP Card */}
            <div className="md:col-span-1">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6 sticky top-24">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-gray-700">Capacity</span>
                            <span className={`font-bold ${isFull ? 'text-red-500' : 'text-primary'}`}>
                                {spotsTaken} / {capacity}
                            </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <div 
                                className={`h-full transition-all duration-500 ${isFull ? 'bg-red-500' : 'bg-primary'}`} 
                                style={{ width: `${Math.min((spotsTaken / capacity) * 100, 100)}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-right">
                            {isFull ? "Event is fully booked" : `${capacity - spotsTaken} spots remaining`}
                        </p>
                    </div>

                    {!isOwner ? (
                        isAttending ? (
                            <div className="space-y-3">
                                <div className="p-3 bg-green-50 border border-green-100 rounded-lg flex items-center justify-center gap-2 text-green-700 font-medium">
                                    <Check className="w-5 h-5" /> You're going!
                                </div>
                                <Button 
                                    variant="outline" 
                                    className="w-full text-destructive hover:bg-red-50 hover:text-destructive border-red-200" 
                                    onClick={handleCancel}
                                    disabled={rsvpLoading}
                                >
                                    {rsvpLoading ? <Loader2 className="animate-spin w-4 h-4"/> : "Cancel RSVP"}
                                </Button>
                            </div>
                        ) : (
                            <Button 
                                className={`w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 ${isFull ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' : ''}`}
                                size="lg" 
                                onClick={handleRSVP} 
                                disabled={isFull || rsvpLoading}
                            >
                                {rsvpLoading ? <Loader2 className="animate-spin w-5 h-5"/> : (isFull ? "Sold Out" : "RSVP Now")}
                            </Button>
                        )
                    ) : (
                        <div className="space-y-3">
                            <Link to={`/edit/${event._id}`} className="block">
                                <Button variant="outline" className="w-full">
                                    <Edit className="w-4 h-4 mr-2" /> Edit Event
                                </Button>
                            </Link>
                            <Button 
                                variant="ghost" 
                                className="w-full text-destructive hover:bg-red-50 hover:text-destructive" 
                                onClick={handleDelete}
                            >
                                <Trash2 className="w-4 h-4 mr-2" /> Delete Event
                            </Button>
                        </div>
                    )}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}