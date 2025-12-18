import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar as CalendarIcon, Users } from 'lucide-react'; // Fixed: Added Users import
import { Progress } from '@/components/ui/progress';

const categoryStyles = {
  conference: 'bg-blue-100 text-blue-700',
  workshop: 'bg-purple-100 text-purple-700',
  meetup: 'bg-green-100 text-green-700',
  webinar: 'bg-orange-100 text-orange-700',
  social: 'bg-pink-100 text-pink-700',
};

export default function EventCard({ event, index = 0 }) {
  const spotsLeft = event.capacity - event.attendees.length;
  const capacityPercentage = (event.attendees.length / event.capacity) * 100;
  const isFull = spotsLeft <= 0;

  // Format date for badge (e.g., "Thu, Dec 18")
  const eventDate = new Date(event.date);
  const dateStr = eventDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link to={`/event/${event._id}`}>
        {/* Added transform-gpu and subpixel-antialiased to fix jitter */}
        <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col transform-gpu subpixel-antialiased">
          
          {/* Image Section */}
          <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
            {event.imageUrl ? (
              <img 
                src={event.imageUrl} 
                alt={event.title} 
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 will-change-transform" 
              />
            ) : (
               <div className="h-full w-full flex items-center justify-center text-gray-400 bg-gray-50">No Image</div>
            )}
            
            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
            
            {/* Category Badge (Top Left) */}
            <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide shadow-sm z-20 ${categoryStyles[event.category] || 'bg-gray-100 text-gray-700'}`}>
                {event.category}
            </div>

            {/* Date Badge (Top Right) */}
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-700 shadow-sm flex items-center gap-1.5 z-20">
                <CalendarIcon className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span>{dateStr}</span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-5 flex flex-col flex-1">
            <h3 className="font-bold text-lg text-gray-900 line-clamp-1 mb-2 group-hover:text-primary transition-colors">
                {event.title}
            </h3>
            
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0 text-gray-400" /> 
              <span className="line-clamp-1">{event.location}</span>
            </div>

            <div className="mt-auto space-y-2">
               <div className="flex justify-between text-xs font-medium">
                 <div className="flex items-center gap-1.5">
                    {/* Fixed: Users icon is now imported correctly */}
                    <Users className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span className={isFull ? 'text-red-500' : 'text-gray-600'}>
                        {isFull ? 'Sold Out' : `${spotsLeft} spots left`}
                    </span>
                 </div>
                 <span className="text-gray-400">{event.attendees.length}/{event.capacity}</span>
               </div>
               
               {/* Custom orange progress bar */}
               <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${isFull ? 'bg-red-500' : 'bg-orange-400'}`}
                    style={{ width: `${capacityPercentage}%` }}
                  />
               </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}