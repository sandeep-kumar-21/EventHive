import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

export default function EventFilters({ category, setCategory }) {
  const categories = ['conference', 'workshop', 'meetup', 'webinar', 'social'];

  return (
    <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
      <div className="flex items-center text-gray-400 mr-1">
        <Filter className="w-5 h-5" />
      </div>
      
      <Button 
          variant={category === '' ? 'default' : 'outline'} 
          onClick={() => setCategory('')}
          className={`rounded-full px-6 transition-all ${
            category === '' 
            ? 'bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20 border-transparent' 
            : 'bg-white hover:bg-gray-50 text-gray-600 border-gray-200'
          }`}
      >
          All Events
      </Button>

      {categories.map(cat => (
          <Button 
              key={cat}
              variant={category === cat ? 'default' : 'outline'} 
              onClick={() => setCategory(cat)}
              className={`rounded-full px-5 capitalize transition-all ${
                category === cat
                ? 'bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20 border-transparent' 
                : 'bg-white hover:bg-gray-50 text-gray-600 border-gray-200'
              }`}
          >
              {cat}
          </Button>
      ))}
    </div>
  );
}