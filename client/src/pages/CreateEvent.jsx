import Navbar from '@/components/layout/Navbar';
import CreateEventForm from '@/components/events/CreateEventForm';

export default function CreateEvent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border">
            <h1 className="text-2xl font-bold mb-6">Create New Event</h1>
            <CreateEventForm />
        </div>
      </div>
    </div>
  );
}