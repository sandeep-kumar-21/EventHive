import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/axios';
import { useToast } from '../hooks/use-toast';

const EventContext = createContext();

export function EventProvider({ children }) {
  const [events, setEvents] = useState([]);
  const { toast } = useToast();

  const fetchEvents = async () => {
    try {
      const { data } = await api.get('/events');
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const addEvent = async (eventData) => {
    const { data } = await api.post('/events', eventData);
    setEvents([...events, data]);
    return data;
  };

  const updateEvent = async (id, eventData) => {
    try {
      const { data } = await api.put(`/events/${id}`, eventData);
      setEvents(events.map(event => event._id === id ? data : event));
      return data;
    } catch (error) {
      throw error;
    }
  };

  const deleteEvent = async (id) => {
    try {
      await api.delete(`/events/${id}`);
      setEvents(events.filter(event => event._id !== id));
      toast({ title: "Success", description: "Event deleted successfully" });
      return true;
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete event", variant: "destructive" });
      return false;
    }
  };

  return (
    <EventContext.Provider value={{ events, fetchEvents, addEvent, updateEvent, deleteEvent }}>
      {children}
    </EventContext.Provider>
  );
}

export const useEvents = () => useContext(EventContext);