import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '@/context/EventContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, ArrowLeft, Upload, Check } from 'lucide-react';
import api from '@/lib/axios';

const sampleImages = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&h=400&fit=crop',
];

export default function CreateEventForm() {
  const navigate = useNavigate();
  const { addEvent } = useEvents();
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [formData, setFormData] = useState({
    title: '', 
    description: '', 
    date: '', 
    time: '', 
    location: '', 
    capacity: '', 
    category: '',
    imageUrl: sampleImages[0]
  });

  // Calculate current date and time for validation
  const today = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toTimeString().slice(0, 5); // HH:MM format

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        toast({ title: "Error", description: "Please upload an image file", variant: "destructive" });
        return;
    }

    const uploadData = new FormData();
    uploadData.append('image', file);

    setUploading(true);
    try {
        const { data: filePath } = await api.post('/upload', uploadData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        const fullPath = `http://localhost:5000${filePath}`;
        setFormData(prev => ({ ...prev, imageUrl: fullPath }));
        toast({ title: "Success", description: "Image uploaded successfully" });
    } catch (error) {
        toast({ title: "Error", description: "Failed to upload image", variant: "destructive" });
    } finally {
        setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) {
        return toast({ title: "Validation Error", description: "Please select a category", variant: "destructive" });
    }

    // Extra validation to ensure user didn't bypass HTML restriction
    const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
    if (selectedDateTime < new Date()) {
        return toast({ title: "Invalid Date", description: "Event time cannot be in the past.", variant: "destructive" });
    }
    
    setLoading(true);
    try {
      await addEvent(formData);
      toast({ title: 'Success', description: 'Event Created Successfully!' });
      navigate('/dashboard');
    } catch (err) {
      toast({ title: 'Error', description: "Failed to create event", variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const generateDesc = async () => {
    if(!formData.title) return toast({ title: "Enter a title first", variant: "destructive" });
    
    setIsGenerating(true);
    try {
        // Use your AI endpoint here if configured, otherwise fallback to simulation
        setTimeout(() => {
            setFormData(prev => ({ 
                ...prev, 
                description: `Join us for ${prev.title}! This is going to be an amazing ${prev.category || 'event'} happening at ${prev.location || 'our venue'}. \n\nExpect great networking opportunities, insightful sessions, and a memorable experience. Don't miss out on this opportunity to connect with like-minded individuals!` 
            }));
            setIsGenerating(false);
            toast({ title: "Generated!", description: "AI description added." });
        }, 1000);
    } catch (error) {
        setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
        <div className="mb-8">
            <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary mb-4" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
            <p className="text-gray-500 mt-2">Fill in the details below to publish your event</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm space-y-8">
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Event Title *</label>
                <Input placeholder="Give your event a catchy title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="h-11"/>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Category *</label>
                <select className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required>
                    <option value="" disabled>Select event type</option>
                    <option value="conference">Conference</option>
                    <option value="workshop">Workshop</option>
                    <option value="meetup">Meetup</option>
                    <option value="webinar">Webinar</option>
                    <option value="social">Social</option>
                </select>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-gray-700">Description *</label>
                    <Button type="button" variant="outline" size="sm" onClick={generateDesc} disabled={isGenerating} className="h-8 text-xs font-medium text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                        {isGenerating ? <Loader2 className="w-3 h-3 animate-spin mr-1.5"/> : <Sparkles className="w-3 h-3 mr-1.5"/>} Auto-Generate with AI
                    </Button>
                </div>
                <Textarea placeholder="Tell people what your event is about..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required className="min-h-[150px] resize-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Date *</label>
                    <Input 
                        type="date" 
                        min={today} // Prevents past dates
                        value={formData.date} 
                        onChange={e => setFormData({...formData, date: e.target.value})} 
                        required 
                        className="h-11"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Time *</label>
                    <Input 
                        type="time" 
                        // If selected date is today, restrict time to future. Otherwise allow all times.
                        min={formData.date === today ? currentTime : undefined}
                        value={formData.time} 
                        onChange={e => setFormData({...formData, time: e.target.value})} 
                        required 
                        className="h-11"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Location *</label>
                    <Input placeholder="Where is it happening?" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required className="h-11"/>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Capacity *</label>
                    <Input type="number" placeholder="Max attendees" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} required min="1" className="h-11"/>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-gray-700">Event Image</label>
                    <div>
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                        <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => fileInputRef.current?.click()} className="h-8 text-xs gap-2">
                            {uploading ? <Loader2 className="w-3 h-3 animate-spin"/> : <Upload className="w-3 h-3" />} Upload from Computer
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {sampleImages.map((img, idx) => (
                        <div key={idx} onClick={() => setFormData({...formData, imageUrl: img})} className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${formData.imageUrl === img ? 'border-primary ring-2 ring-primary/20 scale-[1.02]' : 'border-transparent hover:border-gray-200'}`}>
                            <img src={img} alt={`Cover ${idx + 1}`} className="w-full h-full object-cover" />
                            {formData.imageUrl === img && (
                                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center backdrop-blur-[1px]">
                                    <div className="bg-primary text-white rounded-full p-1 shadow-lg"><Check className="w-4 h-4" strokeWidth={3} /></div>
                                </div>
                            )}
                        </div>
                    ))}
                    {formData.imageUrl && !sampleImages.includes(formData.imageUrl) && (
                        <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-primary ring-2 ring-primary/20 scale-[1.02]">
                            <img src={formData.imageUrl} alt="Uploaded Custom" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center backdrop-blur-[1px]">
                                <div className="bg-primary text-white rounded-full p-1 shadow-lg"><Check className="w-4 h-4" strokeWidth={3} /></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="h-px bg-gray-100 my-6"></div>

            <div className="flex gap-4">
                <Button type="button" variant="outline" className="flex-1 h-12 text-base font-medium" onClick={() => navigate(-1)}>Cancel</Button>
                <Button type="submit" className="flex-1 h-12 text-base font-medium bg-primary hover:bg-primary/90" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin mr-2" /> : 'Create Event'}
                </Button>
            </div>
        </form>
    </div>
  );
}