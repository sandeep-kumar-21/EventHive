import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEvents } from '@/context/EventContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, Upload, Check } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import api from '@/lib/axios';

const sampleImages = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&h=400&fit=crop',
];

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateEvent } = useEvents();
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '', description: '', date: '', time: '', location: '', capacity: '', category: '', imageUrl: ''
  });

  // Fetch existing data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        // Security check
        if (data.createdBy._id !== user._id && data.createdBy !== user._id) {
            toast({ title: "Unauthorized", variant: "destructive" });
            navigate('/dashboard');
            return;
        }
        
        // Format date for input field (YYYY-MM-DD)
        const dateObj = new Date(data.date);
        const dateStr = dateObj.toISOString().split('T')[0];

        setFormData({
            title: data.title,
            description: data.description,
            date: dateStr,
            time: data.time,
            location: data.location,
            capacity: data.capacity,
            category: data.category,
            imageUrl: data.imageUrl
        });
      } catch (error) {
        toast({ title: "Error", description: "Failed to load event", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchEvent();
  }, [id, user, navigate]);

  // Handle File Upload
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
        // const fullPath = `http://localhost:5000${filePath}`;
        const API_BASE_URL = import.meta.env.VITE_API_URL.replace('/api', '');
        const fullPath = `${API_BASE_URL}${filePath}`;
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
    setSubmitting(true);
    try {
      await updateEvent(id, formData);
      toast({ title: 'Success', description: 'Event Updated!' });
      navigate(`/event/${id}`);
    } catch (err) {
      toast({ title: 'Error', description: "Failed to update event", variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto py-10 px-4">
            <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Event</h1>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border shadow-sm space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold">Event Title</label>
                    <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold">Category</label>
                    <select className="w-full h-10 px-3 rounded-md border border-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                        <option value="conference">Conference</option>
                        <option value="workshop">Workshop</option>
                        <option value="meetup">Meetup</option>
                        <option value="webinar">Webinar</option>
                        <option value="social">Social</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold">Description</label>
                    <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required className="min-h-[120px]" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Date</label>
                        <Input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Time</label>
                        <Input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} required />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Location</label>
                        <Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Capacity</label>
                        <Input type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} required />
                    </div>
                </div>

                {/* Updated Image Upload Section */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-semibold text-gray-700">Cover Image</label>
                        <div>
                            <input 
                                type="file" 
                                accept="image/*" 
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                disabled={uploading}
                                onClick={() => fileInputRef.current?.click()}
                                className="h-8 text-xs gap-2"
                            >
                                {uploading ? <Loader2 className="w-3 h-3 animate-spin"/> : <Upload className="w-3 h-3" />}
                                Upload New Image
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Sample Images */}
                        {sampleImages.map((img, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => setFormData({...formData, imageUrl: img})}
                                className={`
                                    relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200
                                    ${formData.imageUrl === img 
                                        ? 'border-primary ring-2 ring-primary/20 scale-[1.02]' 
                                        : 'border-transparent hover:border-gray-200'
                                    }
                                `}
                            >
                                <img src={img} alt={`Cover ${idx + 1}`} className="w-full h-full object-cover" />
                                {formData.imageUrl === img && (
                                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center backdrop-blur-[1px]">
                                        <div className="bg-primary text-white rounded-full p-1 shadow-lg">
                                            <Check className="w-3 h-3" strokeWidth={3} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Custom Image Display (if uploaded and selected) */}
                        {formData.imageUrl && !sampleImages.includes(formData.imageUrl) && (
                            <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-primary ring-2 ring-primary/20 scale-[1.02]">
                                <img src={formData.imageUrl} alt="Uploaded Custom" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center backdrop-blur-[1px]">
                                    <div className="bg-primary text-white rounded-full p-1 shadow-lg">
                                        <Check className="w-3 h-3" strokeWidth={3} />
                                    </div>
                                </div>
                                <div className="absolute top-1 right-1 bg-black/50 text-white text-[10px] px-1.5 rounded">
                                    Current
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(-1)}>Cancel</Button>
                    <Button type="submit" className="flex-1" disabled={submitting}>
                        {submitting ? <Loader2 className="animate-spin" /> : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </div>
    </div>
  );
}